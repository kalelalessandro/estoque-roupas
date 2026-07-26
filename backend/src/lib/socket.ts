import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

let io: Server | null = null;

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: { origin: '*' },
  });
  return io;
}

// Dispara evento para todos os clientes conectados sempre que houver
// mudança de estoque (produto/venda/entrada). O frontend escuta e re-busca os dados.
export function emitStockChanged() {
  io?.emit('stock:changed');
}
