export interface Pixel {
  x: number;
  y: number;
}
export type IncomingMessage = {
  type: string;
  payload: Pixel[];
}