import React from "react";

import CanvasDrawer from "utitilies/canvas-drawer";

const INITIAL_VISIBLE_CANDLES_COUNT = 150;

const SCROLL_BASE_COEFFICIENT = 0.2;
const ZOOM_BASE_COEFFICIENT = 0.999;

const OHLCChart = ({ records }: OHLCFile) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current!;
    const canvas = canvasRef.current!;

    const canvasDrawer = new CanvasDrawer(
      canvas,
      container.clientWidth,
      container.clientHeight,
      records
    );

    canvasDrawer.prepare();
    canvasDrawer.draw(0, INITIAL_VISIBLE_CANDLES_COUNT);

    const transform = { k: 1, x: 0, y: 0 };

    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();

      if (event.ctrlKey) {
        transform.k *= ZOOM_BASE_COEFFICIENT ** event.deltaY;
      } else {
        transform.x -= transform.k * SCROLL_BASE_COEFFICIENT * event.deltaY;
      }

      canvasDrawer.draw(
        transform.x - INITIAL_VISIBLE_CANDLES_COUNT * (transform.k - 1) * 0.5,
        transform.x +
          INITIAL_VISIBLE_CANDLES_COUNT +
          INITIAL_VISIBLE_CANDLES_COUNT * (transform.k - 1) * 0.5
      );
    });
  }, [records]);

  return (
    <div ref={containerRef} style={{ border: "1px solid black", flex: 1 }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default React.memo(OHLCChart);
