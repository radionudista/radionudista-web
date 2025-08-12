'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDebug } from '../../contexts/DebugContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { isDebugMode } from '@/config/env';

const DebugBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(220);
  const [query, setQuery] = useState('');
  const [pinned, setPinned] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { debugInfo, clearDebugInfo } = useDebug();

  const components = useMemo(() => Object.keys(debugInfo).sort((a, b) => a.localeCompare(b)), [debugInfo]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const entries = Object.entries(debugInfo);
    if (!q) return entries;
    return entries.filter(([k, v]) => {
      if (k.toLowerCase().includes(q)) return true;
      try {
        return JSON.stringify(v).toLowerCase().includes(q);
      } catch {
        return false;
      }
    });
  }, [debugInfo, query]);

  useEffect(() => {
    // Determine if the bar should be enabled (env debug OR forced via query/localStorage)
    const computeEnabled = () => {
      try {
        const forced = localStorage.getItem('debug') === '1' ||
          new URL(window.location.href).searchParams.get('debug') === '1' ||
          new URL(window.location.href).searchParams.get('debug') === 'true';
        return isDebugMode() || forced;
      } catch {
        return isDebugMode();
      }
    };
    setEnabled(computeEnabled());

    const saved = localStorage.getItem('rn_debugbar_state');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        setIsOpen(!!s.isOpen);
        setHeight(typeof s.height === 'number' ? s.height : 220);
        setPinned(s.pinned ?? null);
      } catch {
        // noop
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'rn_debugbar_state',
      JSON.stringify({ isOpen, height, pinned })
    );
  }, [isOpen, height, pinned]);

  // Expose a live snapshot as an embedded JSON for vibecoding tools
  useEffect(() => {
    try {
      const id = 'rn-debug-info';
      let el = document.getElementById(id) as HTMLScriptElement | null;
      if (!el) {
        el = document.createElement('script');
        el.id = id;
        el.type = 'application/json';
        document.body.appendChild(el);
      }
      el.text = JSON.stringify(debugInfo);
    } catch {
      // noop
    }
  }, [debugInfo]);

  const onDrag = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const startY = e.clientY;
    const startHeight = height;
    const onMove = (ev: MouseEvent) => {
      const delta = startY - ev.clientY; // dragging up increases height
      const next = Math.min(Math.max(startHeight + delta, 120), window.innerHeight * 0.9);
      setHeight(next);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const pinToggle = (name: string) => setPinned(p => (p === name ? null : name));

  if (!enabled) {
    return null;
  }

  return (
    <div
      id="rn-debugbar"
      data-rn-debugbar="true"
      data-rn-debug-enabled={String(enabled)}
      data-rn-debug-open={String(isOpen)}
      data-rn-debug-count={components.length}
      ref={containerRef}
      className={`fixed bottom-0 left-0 right-0 bg-red-900/90 backdrop-blur-sm text-white transition-all duration-300 ease-in-out z-[9999]`}
      style={{ height: isOpen ? `${height}px` : '22px' }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[22px] text-center text-xs font-bold uppercase tracking-wider flex items-center justify-between px-2"
        aria-expanded={isOpen}
        aria-controls="rn-debugbar-panel"
      >
        <span>Debug Bar</span>
        <span className="text-[10px] opacity-80">{components.length} items</span>
      </button>
      {isOpen && (
        <div id="rn-debugbar-panel" className="bg-black/80 border-t border-white/10 flex flex-col h-[calc(100%-22px)]">
          <div className="flex items-center gap-2 p-2 text-xs">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Filtrar (componente o contenido)"
              className="bg-white/10 rounded px-2 py-1 outline-none flex-1"
              aria-label="Filtro de debug"
            />
            <button
              onClick={() => {
                try {
                  const data = JSON.stringify(debugInfo, null, 2);
                  navigator.clipboard?.writeText(data);
                } catch {}
              }}
              className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
            >
              Copiar JSON
            </button>
            <button
              onClick={() => {
                try {
                  const ts = new Date().toISOString().replace(/[:.]/g, '-');
                  const data = JSON.stringify(debugInfo, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `rn-debug-${ts}.json`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                } catch {}
              }}
              className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
            >
              Descargar
            </button>
            <button
              onClick={() => {
                try {
                  // preferir snapshot global si existe
                  // @ts-ignore
                  const id = window.__RN_DEBUG__?.snapshot?.();
                  if (!id) {
                    const ts = new Date().toISOString().replace(/[:.]/g, '-');
                    const id2 = `rn-debug-snapshot-${ts}`;
                    const payload = { info: debugInfo };
                    let el = document.getElementById(id2) as HTMLScriptElement | null;
                    if (!el) {
                      el = document.createElement('script');
                      el.id = id2;
                      el.type = 'application/json';
                      document.body.appendChild(el);
                    }
                    el.text = JSON.stringify(payload);
                  }
                } catch {}
              }}
              className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
            >
              Snapshot
            </button>
            <button
              onClick={() => {
                try {
                  // @ts-ignore
                  const cleared = window.__RN_DEBUG__?.clearSnapshots?.();
                  if (typeof cleared !== 'number') {
                    const nodes = Array.from(document.querySelectorAll('script[id^="rn-debug-snapshot-"]')) as HTMLScriptElement[];
                    nodes.forEach(n => n.remove());
                  }
                } catch {}
              }}
              className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
            >
              Clear snapshots
            </button>
            <button
              onClick={() => clearDebugInfo()}
              className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
            >
              Limpiar todo
            </button>
            <button
              type="button"
              aria-label="Redimensionar panel de debug"
              className="cursor-row-resize select-none px-2 py-1 bg-white/5 rounded"
              onMouseDown={onDrag}
              title="Arrastra para redimensionar"
            >
              ⇕
            </button>
          </div>
          <div className="p-2 overflow-y-auto flex-1">
            <Accordion type="single" collapsible className="w-full">
              {filtered.map(([componentName, data]) => (
                <AccordionItem value={componentName} key={componentName} className="border-b border-white/10">
                  <AccordionTrigger className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 flex items-center justify-between">
                    <span>{componentName}</span>
                    <span className="ml-2 text-[10px] opacity-70">
                      {pinned === componentName ? 'pinneado' : 'pin'}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="bg-gray-900/50 p-2 rounded-md">
                    <div className="flex items-center gap-2 mb-2 text-[11px]">
                      <button
                        className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
                        onClick={() => pinToggle(componentName)}
                      >
                        {pinned === componentName ? 'Despin' : 'Pin'}
                      </button>
                      <button
                        className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
                        onClick={() => clearDebugInfo(componentName)}
                      >
                        Limpiar
                      </button>
                      {pinned === componentName && (
                        <>
                          <button
                            className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
                            onClick={() => {
                              try {
                                const dataStr = JSON.stringify({ [componentName]: data }, null, 2);
                                navigator.clipboard?.writeText(dataStr);
                              } catch {}
                            }}
                          >
                            Copiar
                          </button>
                          <button
                            className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
                            onClick={() => {
                              try {
                                const ts = new Date().toISOString().replace(/[:.]/g, '-');
                                const payload = JSON.stringify({ [componentName]: data }, null, 2);
                                const blob = new Blob([payload], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `rn-debug-${componentName}-${ts}.json`;
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                URL.revokeObjectURL(url);
                              } catch {}
                            }}
                          >
                            Descargar
                          </button>
                        </>
                      )}
                    </div>
                    <pre
                      className="text-xs whitespace-pre-wrap text-green-400"
                      data-rn-debug-json={JSON.stringify({ [componentName]: data })}
                    >
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {pinned && debugInfo[pinned] && (
              <div className="mt-3 border border-yellow-500/40 rounded p-2 bg-yellow-500/5">
                <div className="text-[11px] uppercase tracking-wider text-yellow-300 mb-1">Pin: {pinned}</div>
                <pre
                  className="text-xs whitespace-pre-wrap text-yellow-200"
                  data-rn-debug-pinned={pinned}
                  data-rn-debug-json={JSON.stringify({ [pinned]: debugInfo[pinned] })}
                >
                  {JSON.stringify(debugInfo[pinned], null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugBar;
