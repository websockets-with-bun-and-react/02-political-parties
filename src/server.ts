import { SERVER_CONFIG } from './config/server-config';
import indexHtml from '../public/index.html';
import { generateUUID } from './utils/generate-uuid';
import type { WEbSocketData } from './types';

export const createServer = () => {
  const server = Bun.serve<WEbSocketData>({
    port: SERVER_CONFIG.port,
    routes: {
      '/': indexHtml,
    },
    fetch(req, server) {
      const clientId = generateUUID();

      const upgraded = server.upgrade(req, {
        data: { clientId },
      });

      if (upgraded) {
        return undefined;
      }

      return new Response('Upgrade failed', { status: 500 });
    },
    websocket: {
      message(ws, message) {
        console.log(message);
      },
      open(ws) {
        console.log(`Client connected with id: ${ws.data.clientId}`);
      },
      close(ws, code, message) {
        console.log(`Client disconnected with id: ${ws.data.clientId}`);
      },
      drain(ws) {},
    },
  });
  return server;
};
