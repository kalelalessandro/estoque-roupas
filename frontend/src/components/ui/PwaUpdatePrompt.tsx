import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useToast } from './ToastProvider';

/**
 * Registers the service worker and surfaces install-time and
 * update-time events through the app's toast system.
 */
export function PwaUpdatePrompt() {
  const toast = useToast();

  const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW({
    onRegisteredSW() {
      // silent — no need to notify on a normal, uneventful registration
    },
  });

  useEffect(() => {
    if (offlineReady[0]) {
      toast('Aplicativo pronto para uso offline.', 'info');
    }
  }, [offlineReady]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (needRefresh[0]) {
      toast('Nova versão disponível. Atualizando...', 'info');
      updateServiceWorker(true);
    }
  }, [needRefresh]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
