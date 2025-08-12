import { useEffect, useMemo, useState } from 'react';

interface HardwareAccelerationInfo {
  isChrome: boolean;
  webglSupported: boolean;
  isProbablyDisabled: boolean;
  renderer?: string;
  vendor?: string;
  userAgent: string;
}

function isChromeBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const vendor = (navigator as any).vendor || '';
  // Exclude Edge and Opera
  const isEdge = ua.includes('Edg/');
  const isOpera = ua.includes('OPR/');
  const isChrome = /Chrome\//.test(ua) && vendor === 'Google Inc.' && !isEdge && !isOpera;
  return isChrome;
}

function detectWebGL(): { supported: boolean; renderer?: string; vendor?: string } {
  try {
    const canvas = document.createElement('canvas');
    const attributes: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true, alpha: false, antialias: false };
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null =
      (canvas.getContext('webgl2', attributes) as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl', attributes) as WebGLRenderingContext | null) ||
      (canvas.getContext('experimental-webgl', attributes) as WebGLRenderingContext | null);

    if (!gl) {
      // Retry without failIfMajorPerformanceCaveat to detect software fallbacks
      gl =
        (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
        (canvas.getContext('webgl') as WebGLRenderingContext | null) ||
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    }

    if (!gl) {
      return { supported: false };
    }

    const debugInfo = (gl as any).getExtension && (gl as any).getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : undefined;
    const vendor = debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : undefined;
    return { supported: true, renderer, vendor };
  } catch {
    return { supported: false };
  }
}

export function useHardwareAccelerationCheck(): HardwareAccelerationInfo {
  const [info, setInfo] = useState<HardwareAccelerationInfo>(() => ({
    isChrome: false,
    webglSupported: false,
    isProbablyDisabled: false,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  }));

  const ua = useMemo(() => (typeof navigator !== 'undefined' ? navigator.userAgent : ''), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const chrome = isChromeBrowser();
    const { supported, renderer, vendor } = detectWebGL();

    const isSoftwareRenderer = (() => {
      const r = (renderer || '').toLowerCase();
      // Common software/disabled indicators
      return /swiftshader|software|llvmpipe|microsoft basic render|mesa/i.test(r);
    })();

    const isProbablyDisabled = chrome ? (!supported || isSoftwareRenderer) : false;

    setInfo({
      isChrome: chrome,
      webglSupported: supported,
      isProbablyDisabled,
      renderer,
      vendor,
      userAgent: ua,
    });
  }, [ua]);

  return info;
}


