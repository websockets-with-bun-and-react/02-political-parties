import { SERVER_CONFIG } from './config/server-config';
import indexHtml from '../public/index.html';
import { generateUUID } from './utils/generate-uuid';
import type { WEbSocketData } from './types';
import { handlerMessage } from './handlers/message-handler';

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
      open(ws) {
        console.log(`Client connected with id: ${ws.data.clientId}`);
        ws.subscribe(SERVER_CONFIG.defaultChannelName);
      },
      message(ws, message: string) {
        const response = handlerMessage(message);

        const responseString = JSON.stringify(response);

        if (response.type === 'ERROR') {
          ws.send(responseString);
          return;
        }

        if (response.type === 'PARTIES_LIST') {
          ws.send(responseString);
          return;
        }

        ws.send(responseString);
        ws.publish(SERVER_CONFIG.defaultChannelName, responseString);
      },
      close(ws, code, message) {
        console.log(`Client disconnected with id: ${ws.data.clientId}`);
      },
      drain(ws) {},
    },
  });
  return server;
};
