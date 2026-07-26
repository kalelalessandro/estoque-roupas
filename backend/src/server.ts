import 'dotenv/config';
import http from 'http';
import { app } from './app';
import { initSocket } from './lib/socket';

const PORT = process.env.PORT || 3333;

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
