import React, { useState } from 'react';
import { useHardwareAccelerationCheck } from '@/hooks/useHardwareAccelerationCheck';


const HardwareAccelerationNotice: React.FC = () => {
  const { isChrome, isProbablyDisabled, renderer } = useHardwareAccelerationCheck();
  const [dismissed, setDismissed] = useState<boolean>(false);

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (!isChrome || !isProbablyDisabled || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998]">
      <div className="mx-auto max-w-7xl">
        <div className="m-2 rounded-md border border-yellow-500/40 bg-yellow-500/10 text-yellow-100 backdrop-blur-md">
          <div className="px-4 py-3 flex items-start gap-3">
            <div className="text-yellow-300 font-semibold">Aceleración por hardware desactivada en Chrome</div>
            <div className="text-sm opacity-90 flex-1 leading-snug">
              <p className="mt-1">
                Para ver el logo y los visuales correctamente, activa la aceleración por hardware en Chrome: Configuración → Sistema → «Usar aceleración por hardware cuando esté disponible». Reinicia Chrome.
              </p>
              {renderer ? (
                <span className="block mt-1 text-xs opacity-70">Renderer: {renderer}</span>
              ) : null}
            </div>
            <button
              onClick={handleDismiss}
              className="ml-auto px-3 py-1 text-xs font-medium rounded border border-yellow-500/40 hover:bg-yellow-500/20"
            >
              Ocultar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareAccelerationNotice;


