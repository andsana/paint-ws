import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import {ActiveConnections, IncomingMessage, Pixel} from './types';
import crypto from 'crypto';

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());

const router = express.Router();

const activeConnections: ActiveConnections = {};
const drawnPixels: Pixel[] = [
  {x: 20, y: 20},
  {x: 30, y: 30},
  {x: 40, y: 40},
];

router.ws('/paint', (ws) => {
  const id = crypto.randomUUID();
  console.log('client connected id=', id);
  activeConnections[id] = ws;

  ws.send(JSON.stringify({type: 'EXISTING_PIXELS', payload: drawnPixels}));

  ws.on('message', (messageData) => {
    const parsedMessage = JSON.parse(messageData.toString()) as IncomingMessage;

    if (parsedMessage.type === 'DRAW_PIXELS') {
      for (const pixel of parsedMessage.payload) {
        const existing = drawnPixels.find(p => p.x === pixel.x && p.y === pixel.y)
        if (!existing) {
          drawnPixels.push(pixel);
        }
      }

      Object.values(activeConnections).forEach(connection => {
        connection.send(messageData);
      });
    }
  });

  ws.on('close', () => {
    console.log('client disconnected! id=', id);
    delete activeConnections[id];
  });
});

app.use(router);

app.listen(port, () => {
  console.log(`Server started on ${port} port!`);
});




