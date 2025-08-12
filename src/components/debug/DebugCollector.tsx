import { useEffect, useRef } from 'react';
import { useDebug } from '@/contexts/DebugContext';
import { isDebugMode } from '@/config/env';
import { useQueryClient } from '@tanstack/react-query';
import i18n from '@/config/i18n';
import { getTwitchPlayerUrl } from '@/utils/twitchUtils';

// Helpers
const getForcedDebug = () => {
  try {
    const url = new URL(window.location.href);
    const q = url.searchParams.get('debug');
    return q === '1' || q === 'true' || localStorage.getItem('debug') === '1';
  } catch {
    return false;
  }
};

const ensureScript = (id: string, data: unknown) => {
  try {
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/json';
      document.body.appendChild(el);
    }
    el.text = JSON.stringify(data);
  } catch {
    // noop
  }
};

const setupConsoleProxy = (publish: (payload: any) => void) => {
  const original = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug,
  } as const;

  const wrap = (level: keyof typeof original) => {
    return (...args: any[]) => {
      try {
        publish({
          level,
          args: args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))),
          time: new Date().toISOString(),
        });
      } catch {}
      original[level](...args);
    };
  };

  console.log = wrap('log');
  console.warn = wrap('warn');
  console.error = wrap('error');
  console.info = wrap('info');
  console.debug = wrap('debug');

  return () => {
    console.log = original.log;
    console.warn = original.warn;
    console.error = original.error;
    console.info = original.info;
    console.debug = original.debug;
  };
};

const setupFetchProxy = (
  onLog: (entry: any, list: any[]) => void,
) => {
  const originalFetch = window.fetch.bind(window);
  let logs: any[] = [];

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const start = performance.now();
    const url = typeof input === 'string' ? input : (input as Request).url ?? String(input);
    const method = (init?.method || (input instanceof Request ? input.method : 'GET') || 'GET').toUpperCase();
    try {
      const response = await originalFetch(input as any, init);
      const end = performance.now();
      const entry = {
        url,
        method,
        status: response.status,
        ok: response.ok,
        latency: Math.round(end - start),
        time: new Date().toISOString(),
      };
      logs = [...logs.slice(-49), entry];
      onLog(entry, logs);
      return response;
    } catch (error: any) {
      const end = performance.now();
      const entry = {
        url,
        method,
        error: String(error?.message || error),
        latency: Math.round(end - start),
        time: new Date().toISOString(),
      };
      logs = [...logs.slice(-49), entry];
      onLog(entry, logs);
      throw error;
    }
  };

  return () => {
    window.fetch = originalFetch;
  };
};

const setupPerfInterval = (onPerf?: (perf: any) => void) => {
  const updatePerf = () => {
    try {
      const nav = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming) || null;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const perf = {
        time: new Date().toISOString(),
        navigation: nav
          ? {
              domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
              load: Math.round(nav.loadEventEnd - nav.startTime),
              redirect: Math.round(nav.redirectEnd - nav.redirectStart),
              dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
              connect: Math.round(nav.connectEnd - nav.connectStart),
              ttfb: Math.round(nav.responseStart - nav.requestStart),
            }
          : null,
        resources: {
          count: resources.length,
          byInitiatorType: resources.reduce<Record<string, number>>((acc, r) => {
            const key = (r.initiatorType || 'other');
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {}),
        },
      };
      ensureScript('rn-debug-perf', perf);
      if (onPerf) onPerf(perf);
    } catch {}
  };

  updatePerf();
  const id = window.setInterval(updatePerf, 15000);
  return () => window.clearInterval(id);
};

const setupSummary = () => {
  const buildSummary = () => {
    try {
      const envEl = document.getElementById('rn-debug-env') as HTMLScriptElement | null;
      const env = envEl?.text ? JSON.parse(envEl.text) : {};
      const info = (window as any).__RN_DEBUG__?.info || {};
      const audio = info?.Audio || {};
      const rq = info?.ReactQuery || {};
      const tw = info?.Twitch || {};
      return `RN | playing:${audio.isPlaying ? '1' : '0'} vol:${audio.volume ?? '-'} track:${(audio.currentTrack || '').slice(0,30)} rq(f:${rq.fetching ?? 0}/s:${rq.stale ?? 0}) twErr:${tw.playerError ? '1' : '0'} lang:${env.language || '-'}`;
    } catch {
      return 'RN | summary unavailable';
    }
  };
  let el = document.getElementById('rn-debug-summary');
  if (!el) {
    el = document.createElement('div');
    el.id = 'rn-debug-summary';
    el.setAttribute('data-rn-summary', 'true');
    el.style.position = 'fixed';
    el.style.bottom = '0';
    el.style.right = '0';
    el.style.zIndex = '9998';
    el.style.background = 'rgba(0,0,0,0.5)';
    el.style.color = 'white';
    el.style.fontSize = '10px';
    el.style.fontFamily = 'monospace';
    el.style.padding = '2px 4px';
    document.body.appendChild(el);
  }
  el.textContent = buildSummary();
  const interval = window.setInterval(() => {
    const target = document.getElementById('rn-debug-summary');
    if (target) target.textContent = buildSummary();
  }, 2000);
  return () => window.clearInterval(interval);
};

/**
 * DebugCollector
 * - Fuerza modo debug por query/localStorage: ?debug=1, localStorage.debug=1
 * - Captura errores globales y eventos de consola (solo en debug)
 * - Expone algunos metadatos del entorno
 */
const DebugCollector = () => {
  const { setDebugInfo, debugInfo } = useDebug();
  const queryClient = useQueryClient();
  const networkLogsRef = useRef<Array<any>>([]);

  const syncScript = ensureScript;

  useEffect(() => {
    // Permitir activar debug via query/localStorage, útil para entornos feature/local
    const url = new URL(window.location.href);
    const qDebug = url.searchParams.get('debug');
    if (qDebug === '1' || qDebug === 'true') {
      localStorage.setItem('debug', '1');
    }

    // Registrar metadatos
    const envData = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      now: new Date().toISOString(),
      isDebugMode: isDebugMode(),
      forcedByQuery: qDebug === '1' || qDebug === 'true',
      forcedByLocalStorage: localStorage.getItem('debug') === '1',
    } as const;
    setDebugInfo('App/Env', envData);
    syncScript('rn-debug-env', envData);

    if (!isDebugMode() && localStorage.getItem('debug') !== '1') return;

    // Hook de errores globales
    const onError = (event: ErrorEvent) => {
      setDebugInfo('GlobalError', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error ? String(event.error) : null,
        time: new Date().toISOString(),
      });
    };
    window.addEventListener('error', onError);

    // Hook de promesas no manejadas
    const onUnhandled = (event: PromiseRejectionEvent) => {
      setDebugInfo('UnhandledRejection', {
        reason: event.reason ? String(event.reason) : null,
        time: new Date().toISOString(),
      });
    };
    window.addEventListener('unhandledrejection', onUnhandled);

    // Proxy de consola
    const restoreConsole = setupConsoleProxy(payload => setDebugInfo('Console', payload));

    // Exponer dataset global embebido para modelos que inspeccionan HTML
    syncScript('rn-debug-dump', { Console: 'proxied', notes: 'Use Debug Bar entries for details' });

    // Patch fetch para logging de red
    const restoreFetch = setupFetchProxy((entry, list) => {
      networkLogsRef.current = list;
      setDebugInfo('Network', { last: entry, count: list.length });
      syncScript('rn-debug-network', list);
    });

    // Snapshot de performance
    const cleanupPerf = setupPerfInterval(perf => setDebugInfo('Perf', perf));

    // React Query snapshot
    const updateQuery = () => {
      try {
        const queries = queryClient.getQueryCache().findAll();
        const summary = {
          time: new Date().toISOString(),
          total: queries.length,
          fetching: queries.filter(q => q.state.fetchStatus === 'fetching').length,
          paused: queries.filter(q => q.state.fetchStatus === 'paused').length,
          stale: queries.filter(q => q.isStale()).length,
          errors: queries.filter(q => q.state.error != null).slice(0, 5).map(q => ({ key: q.queryKey, error: String(q.state.error) })),
        };
        syncScript('rn-debug-react-query', summary);
        setDebugInfo('ReactQuery', summary);
      } catch {}
    };
    updateQuery();
    const unsubscribe = queryClient.getQueryCache().subscribe(updateQuery);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandled);
      // Restaurar consola
      restoreConsole();
      // Restaurar fetch
      restoreFetch();
      // Limpieza
      cleanupPerf();
      unsubscribe?.();
    };
  }, [setDebugInfo, queryClient]);

  // Espejo global en window y API de snapshot
  useEffect(() => {
    try {
      const envEl = document.getElementById('rn-debug-env') as HTMLScriptElement | null;
      const env = envEl?.text ? JSON.parse(envEl.text) : {};
      (window as any).__RN_DEBUG__ = {
        info: debugInfo,
        env,
        snapshot: () => {
          const ts = new Date().toISOString().replace(/[:.]/g, '-');
          const data = { info: debugInfo, env };
          const id = `rn-debug-snapshot-${ts}`;
          let el = document.getElementById(id) as HTMLScriptElement | null;
          if (!el) {
            el = document.createElement('script');
            el.id = id;
            el.type = 'application/json';
            document.body.appendChild(el);
          }
          el.text = JSON.stringify(data);
          return id;
        },
        clearSnapshots: () => {
          try {
            const nodes = Array.from(document.querySelectorAll('script[id^="rn-debug-snapshot-"]')) as HTMLScriptElement[];
            nodes.forEach(n => n.remove());
            return nodes.length;
          } catch {
            return 0;
          }
        },
      };
    } catch {
      // noop
    }
  }, [debugInfo]);

  // Hotkey: Alt+D para snapshot
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        try {
          (window as any).__RN_DEBUG__?.snapshot?.();
        } catch {
          // noop
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Resumen mínimo siempre visible
  useEffect(() => {
    try {
      const buildSummary = () => {
        const envEl = document.getElementById('rn-debug-env') as HTMLScriptElement | null;
        const env = envEl?.text ? JSON.parse(envEl.text) : {};
        const info = (window as any).__RN_DEBUG__?.info || {};
        const audio = info?.Audio || {};
        const rq = info?.ReactQuery || {};
        return `RN | playing:${audio.isPlaying ? '1' : '0'} vol:${audio.volume ?? '-'} track:${(audio.currentTrack || '').slice(0,30)} rq(f:${rq.fetching ?? 0}/s:${rq.stale ?? 0}) lang:${env.language || '-'} `;
      };
      let el = document.getElementById('rn-debug-summary');
      if (!el) {
        el = document.createElement('div');
        el.id = 'rn-debug-summary';
        el.setAttribute('data-rn-summary', 'true');
        el.style.position = 'fixed';
        el.style.bottom = '0';
        el.style.right = '0';
        el.style.zIndex = '9998';
        el.style.background = 'rgba(0,0,0,0.5)';
        el.style.color = 'white';
        el.style.fontSize = '10px';
        el.style.fontFamily = 'monospace';
        el.style.padding = '2px 4px';
        document.body.appendChild(el);
      }
      el.textContent = buildSummary();

      const interval = window.setInterval(() => {
        const target = document.getElementById('rn-debug-summary');
        if (target) target.textContent = buildSummary();
      }, 2000);
      return () => window.clearInterval(interval);
    } catch {
      // noop
    }
  }, []);

  // Publicar info de Twitch incluso si el componente TwitchPlayer no está montado
  useEffect(() => {
    try {
      const forced = getForcedDebug();
      if (!isDebugMode() && !forced) return;
      const url = getTwitchPlayerUrl();
      // Detección básica de Brave
      const anyNav = navigator as any;
      const bravePromise: Promise<boolean> = anyNav?.brave?.isBrave ? anyNav.brave.isBrave() : Promise.resolve(false);
      bravePromise
        .then((isBrave: boolean) => {
          const twitchInfo = {
            twitchUrl: url,
            isBraveOrBlocked: !!isBrave,
            playerError: false,
            source: 'collector',
          };
          setDebugInfo('Twitch', twitchInfo);
          ensureScript('rn-debug-twitch', twitchInfo);
        })
        .catch(() => {
          const twitchInfo = {
            twitchUrl: url,
            isBraveOrBlocked: false,
            playerError: false,
            source: 'collector',
          };
          setDebugInfo('Twitch', twitchInfo);
          ensureScript('rn-debug-twitch', twitchInfo);
        });
    } catch {
      // noop
    }
  }, [setDebugInfo]);

  // I18n snapshot and updates
  useEffect(() => {
    try {
      const publish = () => {
        const data = {
          language: i18n.language,
          supported: i18n.options.supportedLngs || [],
          initialized: i18n.isInitialized,
        };
        setDebugInfo('I18n', data);
        ensureScript('rn-debug-i18n', data);
      };
      publish();
      i18n.on('languageChanged', publish);
      return () => {
        i18n.off('languageChanged', publish);
      };
    } catch {
      // noop
    }
  }, [setDebugInfo]);

  // Responsive snapshot (resize listener)
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const isMobile = w < 768;
      const isTablet = w >= 768 && w < 1024;
      const isDesktop = w >= 1024;
      const data = { width: w, isMobile, isTablet, isDesktop };
      try {
        if (isMobile) {
          document.body.setAttribute('data-rn-viewport', 'mobile');
        } else if (isTablet) {
          document.body.setAttribute('data-rn-viewport', 'tablet');
        } else {
          document.body.setAttribute('data-rn-viewport', 'desktop');
        }
      } catch {}
      setDebugInfo('Responsive', data);
      ensureScript('rn-debug-responsive', data);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [setDebugInfo]);

  // I18n missing keys tracker
  const missingKeysRef = useRef<string[]>([]);
  useEffect(() => {
    try {
      const onMissingKey = (_lngs: string[], ns: string, key: string) => {
        const id = `${ns}:${key}`;
        if (!missingKeysRef.current.includes(id)) {
          missingKeysRef.current = [...missingKeysRef.current, id].slice(-100);
        }
        const data = { count: missingKeysRef.current.length, keys: missingKeysRef.current };
        setDebugInfo('I18nMissing', data);
        ensureScript('rn-debug-i18n-missing', data);
      };
      i18n.on('missingKey', onMissingKey);
      return () => {
        i18n.off('missingKey', onMissingKey);
      };
    } catch {
      // noop
    }
  }, [setDebugInfo]);

  // FPS estimator
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();
    let frames = 0;
    let acc = 0;
    const loop = (now: number) => {
      frames += 1;
      const delta = now - last;
      if (delta >= 1000) {
        const fps = Math.round((frames * 1000) / delta);
        const data = { fps, at: new Date().toISOString() };
        setDebugInfo('FPS', data);
        ensureScript('rn-debug-fps', data);
        frames = 0;
        last = now;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [setDebugInfo]);

  // Route snapshot (without Router context)
  useEffect(() => {
    const publish = () => {
      const data = { pathname: window.location.pathname, search: window.location.search, hash: window.location.hash };
      setDebugInfo('Route', data);
      ensureScript('rn-debug-route', data);
    };
    publish();
    const onPop = () => publish();
    window.addEventListener('popstate', onPop);
    // Patch pushState/replaceState
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...args) {
      const ret = origPush.apply(this, args as any);
      publish();
      return ret;
    } as any;
    history.replaceState = function (...args) {
      const ret = origReplace.apply(this, args as any);
      publish();
      return ret;
    } as any;
    return () => {
      window.removeEventListener('popstate', onPop);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, [setDebugInfo]);

  return null;
};

export default DebugCollector;


