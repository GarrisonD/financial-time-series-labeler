import React from "react";

import CanvasDrawer from "utitilies/canvas-drawer";
import CanvasOnSteroids, { CanvasOnSteroidsProps } from "./CanvasOnSteroids";

import useDimensions from "hooks/useDimensions";

const INITIAL_VISIBLE_CANDLES_COUNT = 150;

const SCROLL_BASE_COEFFICIENT = 0.2;
const ZOOM_BASE_COEFFICIENT = 0.999;

const transform = { k: 1, x: 0, y: 0 };

const CandlesticksChart = ({ candlesticks }: NamedCandlesticks) => {
  const [containerRef, containerDimensions] = useDimensions<HTMLDivElement>();
  const [canvasDrawer, setCanvasDrawer] = React.useState<CanvasDrawer>();

  const handleContextReady = React.useCallback<
    CanvasOnSteroidsProps["onContextReady"]
  >(
    (context) => {
      const canvasDrawer = new CanvasDrawer(
        context,
        containerDimensions!.width,
        containerDimensions!.height,
        candlesticks
      );

      canvasDrawer.draw(0, INITIAL_VISIBLE_CANDLES_COUNT);

      setCanvasDrawer(canvasDrawer);
    },
    [candlesticks, containerDimensions]
  );

  const handleCanvasOnSteroidsWheel = React.useCallback<
    CanvasOnSteroidsProps["onWheel"]
  >(
    (event) => {
      if (event.ctrlKey) {
        transform.k *= ZOOM_BASE_COEFFICIENT ** event.deltaY;
      } else {
        transform.x -= transform.k * SCROLL_BASE_COEFFICIENT * event.deltaY;
      }

      canvasDrawer?.draw(
        transform.x - INITIAL_VISIBLE_CANDLES_COUNT * (transform.k - 1) * 0.5,
        transform.x +
          INITIAL_VISIBLE_CANDLES_COUNT +
          INITIAL_VISIBLE_CANDLES_COUNT * (transform.k - 1) * 0.5
      );
    },
    [canvasDrawer]
  );

  return (
    <div ref={containerRef} style={{ border: "1px solid black", flex: 1 }}>
      {containerDimensions != null && (
        <CanvasOnSteroids
          {...containerDimensions}
          onContextReady={handleContextReady}
          onWheel={handleCanvasOnSteroidsWheel}
        />
      )}
    </div>
  );
};

export default React.memo(CandlesticksChart);
