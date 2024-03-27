import React, {useEffect, useRef, useState} from 'react';
import {IncomingMessage} from './types';

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const drawPixel = (x: number, y: number) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.fillStyle = 'green';
    ctx.fillRect(x - 5, y - 5, 10, 10);
  };

  const onMouseDown = () => {
    setIsMouseDown(true);
  };

  const onMouseUp = () => {
    if (!ws.current) {
      return;
    }

    setIsMouseDown(false);
  };

  const onMouseMove = (event: React.MouseEvent) => {
    if (!isMouseDown || !ws.current) {
      return;
    }

    ws.current.send(JSON.stringify({
      type: 'DRAW_PIXELS', payload: [{
        x: event.clientX,
        y: event.clientY,
      }]
    }));
  };

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/paint');

    ws.current.addEventListener('close', () => console.log('ws closed'));

    ws.current.addEventListener('message', (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      if (decodedMessage.type === 'DRAW_PIXELS' || decodedMessage.type === 'EXISTING_PIXELS') {
        for (const pixel of decodedMessage.payload) {
          drawPixel(pixel.x, pixel.y);
        }
      }
    });

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{border: '1px solid black'}}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    />
  );
}

export default App;
