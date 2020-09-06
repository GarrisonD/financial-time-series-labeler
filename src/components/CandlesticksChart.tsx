import React from "react";

import CanvasScaleContext from "contexts/CanvasScale";

import useDimensions from "hooks/useDimensions";
import useInfiniteDrawerWorker from "hooks/useInfiniteDrawerWorker";

import useOffset from "hooks/charting/useOffset";
import useScale from "hooks/charting/useScale";

import CanvasOnSteroids, {
  CanvasOnSteroidsProps,
  RenderingContextProvider,
} from "./CanvasOnSteroids";

const INITIAL_VISIBLE_CANDLES_COUNT = 150;

const CandlesticksChart = ({ candlesticks }: NamedCandlesticks) => {
  const [containerRef, containerDimensions] = useDimensions<HTMLDivElement>();

  const [
    renderingContextProvider,
    setRenderingContextProvider,
  ] = React.useState<RenderingContextProvider>();

  const [chartOffset, changeChartOffsetBy] = useOffset();
  const [chartScale, changeChartScaleBy] = useScale();

  const canvasScale = React.useContext(CanvasScaleContext);

  const [
    isWorkerReady,
    isScaledCanvasDrawerReady,
    isInfiniteDrawingLoopPlaying,
    {
      // ScaledCanvasDrawer-related:
      initScaledCanvasDrawer,
      updateScaledCanvasDrawer,
      // InfiniteDrawer-related:
      playInfiniteDrawer,
    },
  ] = useInfiniteDrawerWorker();

  React.useEffect(() => {
    if (renderingContextProvider instanceof OffscreenCanvas) {
      const offscreenCanvas = renderingContextProvider;

      if (containerDimensions) {
        initScaledCanvasDrawer({
          canvasScale,
          offscreenCanvas,
          candlesticks,
          ...containerDimensions,
        });
      }
    }
  }, [
    candlesticks,
    canvasScale,
    containerDimensions,
    initScaledCanvasDrawer,
    renderingContextProvider,
  ]);

  React.useEffect(() => {
    if (!isWorkerReady || !isScaledCanvasDrawerReady) return;

    const tmp = INITIAL_VISIBLE_CANDLES_COUNT * (chartScale - 1);

    updateScaledCanvasDrawer({
      firstVisibleCandleIndex: chartOffset - tmp / 2 + 0,
      lastVisibleCandleIndex:
        chartOffset + tmp / 2 + INITIAL_VISIBLE_CANDLES_COUNT,
    });

    if (!isInfiniteDrawingLoopPlaying) {
      playInfiniteDrawer();
    }
  }, [
    chartOffset,
    chartScale,
    isInfiniteDrawingLoopPlaying,
    isScaledCanvasDrawerReady,
    isWorkerReady,
    playInfiniteDrawer,
    updateScaledCanvasDrawer,
  ]);

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
          onRenderingContextProviderReady={setRenderingContextProvider}
          onWheel={handleCanvasOnSteroidsWheel}
          {...containerDimensions}
        />
      )}
    </div>
  );
};

export default React.memo(CandlesticksChart);
