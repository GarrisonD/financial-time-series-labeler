import React from "react";

import CanvasDrawer from "utitilies/canvas-drawer";

const SCALE = window.devicePixelRatio;

const INITIAL_VISIBLE_CANDLES_COUNT = 150;

const SCROLL_BASE_COEFFICIENT = 0.2;
const ZOOM_BASE_COEFFICIENT = 0.999;

const GET_CONTEXT_2D_FAILED_MSG =
  "Getting of 2D Context failed... May your browser not support it?..";

const CandlesticksChart = ({ candlesticks }: NamedCandlesticks) => {
  const [containerDimensions, setContainerDimensions] = React.useState<{
    height: number;
    width: number;
  }>({ height: 0, width: 0 });

  const containerRef = React.useCallback((container: HTMLDivElement | null) => {
    setContainerDimensions({
      height: container!.clientHeight,
      width: container!.clientWidth,
    });
  }, []);

  const canvasRef = React.useCallback(
    (canvas: HTMLCanvasElement | null) => {
      console.log({ canvas });

      if (canvas == null) return;

      const context = canvas.getContext("2d");

      if (context == null) throw new Error(GET_CONTEXT_2D_FAILED_MSG);

      context.scale(SCALE, SCALE);

      const canvasDrawer = new CanvasDrawer(
        context,
        containerDimensions.width,
        containerDimensions.height,
        candlesticks
      );

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
    },
    [candlesticks, containerDimensions.height, containerDimensions.width]
  );

  return (
    <div ref={containerRef} style={{ border: "1px solid black", flex: 1 }}>
      <canvas
        ref={canvasRef}
        style={containerDimensions}
        // Keep these two props groupped
        height={containerDimensions.height * SCALE}
        width={containerDimensions.width * SCALE}
      />
    </div>
  );
};

export default React.memo(CandlesticksChart);
