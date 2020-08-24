import React from "react";

import CanvasDrawer from "utitilies/canvas-drawer";
import CanvasOnSteroids, { CanvasOnSteroidsProps } from "./CanvasOnSteroids";

import useDimensions from "hooks/useDimensions";

import useOffset from "hooks/charting/useOffset";
import useScale from "hooks/charting/useScale";

const INITIAL_VISIBLE_CANDLES_COUNT = 150;

const CandlesticksChart = ({ candlesticks }: NamedCandlesticks) => {
  const [containerRef, containerDimensions] = useDimensions<HTMLDivElement>();
  const [canvasDrawer, setCanvasDrawer] = React.useState<CanvasDrawer>();

  const [offset, changeOffsetBy] = useOffset();
  const [scale, changeScaleBy] = useScale();

  React.useEffect(() => {
    const tmp = INITIAL_VISIBLE_CANDLES_COUNT * (scale - 1);

    canvasDrawer?.draw(
      offset - tmp / 2 + 0,
      offset + tmp / 2 + INITIAL_VISIBLE_CANDLES_COUNT
    );
  }, [canvasDrawer, offset, scale]);

  const handleContextReady = React.useCallback<
    CanvasOnSteroidsProps["onContextReady"]
  >(
    (context) => {
      setCanvasDrawer(
        new CanvasDrawer(
          context,
          containerDimensions!.width,
          containerDimensions!.height,
          candlesticks
        )
      );
    },
    [candlesticks, containerDimensions]
  );

  const handleCanvasOnSteroidsWheel = React.useCallback<
    CanvasOnSteroidsProps["onWheel"]
  >(
    (event) => {
      if (event.ctrlKey) {
        changeScaleBy(event.deltaY);
      } else {
        changeOffsetBy(event.deltaY * scale);
      }
    },
    [changeOffsetBy, changeScaleBy, scale]
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
