import {WebSocket} from 'ws';

export interface Pixel {
  x: number;
  y: number;
}

export interface ActiveConnections {
  [id: string]: WebSocket;
}

export interface IncomingMessage {
  type: string;
  payload: Pixel[];
}