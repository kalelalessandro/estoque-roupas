import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3333', {
  autoConnect: false,
});

// Conecta ao servidor de WebSocket e chama `onChange` sempre que o estoque
// mudar em qualquer lugar (outra aba, outro usuário, outra tela).
export function useRealtime(onChange: () => void) {
  useEffect(() => {
    socket.connect();
    socket.on('stock:changed', onChange);

    return () => {
      socket.off('stock:changed', onChange);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
