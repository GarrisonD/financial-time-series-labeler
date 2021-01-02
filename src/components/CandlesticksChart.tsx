import React from "react";

import useDimensions from "hooks/useDimensions";

import useOffset from "hooks/charting/useOffset";
import useScale from "hooks/charting/useScale";

import InfiniteDrawer from "drawers/high-level/infinite-drawer";
import CandlesticksDrawer from "drawers/high-level/candlesticks-drawer";

import CanvasOnSteroids, { CanvasOnSteroidsProps } from "./CanvasOnSteroids";

const INITIAL_VISIBLE_CANDLES_COUNT = 150;

const CandlesticksChart = ({ candlesticks }: NamedCandlesticks) => {
  const [containerRef, containerDimensions] = useDimensions<HTMLDivElement>();

  const [chartOffset, changeChartOffsetBy] = useOffset();
  const [chartScale, changeChartScaleBy] = useScale();

  const [candlesticksDrawer, setCandlesticksDrawer] = React.useState<
    CandlesticksDrawer
  >();

  React.useEffect(() => {
    if (candlesticksDrawer) {
      const infiniteDrawer = new InfiniteDrawer(candlesticksDrawer);

      infiniteDrawer.play();

      return () => {
        infiniteDrawer.stop();
      };
    }
  }, [candlesticksDrawer]);

  React.useEffect(() => {
    // prettier-ignore
    if (candlesticksDrawer) {
      const tmp = INITIAL_VISIBLE_CANDLES_COUNT * (chartScale - 1);
      candlesticksDrawer.firstVisibleCandleIndex = chartOffset - tmp / 2 + 0;
      candlesticksDrawer.lastVisibleCandleIndex = chartOffset + tmp / 2 + INITIAL_VISIBLE_CANDLES_COUNT;
    }
  }, [chartOffset, chartScale, candlesticksDrawer]);

  const handleCanvasDrawerReady = React.useCallback<
    CanvasOnSteroidsProps["onCanvasDrawerReady"]
  >(
    (canvasDrawer) => {
      setCandlesticksDrawer(
        // prettier-ignore
        new CandlesticksDrawer(
          canvasDrawer,
          candlesticks
        )
      );
    },
    [candlesticks]
  );

  const handleCanvasOnSteroidsWheel = React.useCallback<
    CanvasOnSteroidsProps["onWheel"]
  >(
    (event) => {
      if (event.ctrlKey) {
        changeChartScaleBy(event.deltaY);
      } else {
        changeChartOffsetBy(event.deltaY * chartScale);
      }
    },
    [changeChartOffsetBy, changeChartScaleBy, chartScale]
  );

  return (
    <div ref={containerRef} style={{ border: "1px solid black", flex: 1 }}>
      {containerDimensions != null && (
        <CanvasOnSteroids
          onCanvasDrawerReady={handleCanvasDrawerReady}
          onWheel={handleCanvasOnSteroidsWheel}
          {...containerDimensions}
        />
      )}
    </div>
  );
};

export default React.memo(CandlesticksChart);
