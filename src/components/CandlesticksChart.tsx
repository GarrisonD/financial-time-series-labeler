import React from "react";

import CanvasScaleContext from "contexts/CanvasScale";

import useDimensions from "hooks/useDimensions";
import useInfiniteDrawerWorker from "hooks/useInfiniteDrawerWorker";

import useOffset from "hooks/charting/useOffset";
import useScale from "hooks/charting/useScale";

import InfiniteDrawer from "utils/infinite-drawer";
import ScaledCanvasDrawer from "utils/scaled-canvas-drawer";

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
    isScaledCanvasDrawerReady,
    {
      // ScaledCanvasDrawer-related:
      initScaledCanvasDrawer,
      updateScaledCanvasDrawer,
      // InfiniteDrawer-related:
      playInfiniteDrawer,
      stopInfiniteDrawer,
    },
  ] = useInfiniteDrawerWorker();

  const [scaledCanvasDrawer, setScaledCanvasDrawer] = React.useState<
    ScaledCanvasDrawer
  >();

  React.useEffect(() => {
    if (renderingContextProvider) {
      if (renderingContextProvider instanceof OffscreenCanvas) {
        const offscreenCanvas = renderingContextProvider;

        initScaledCanvasDrawer({
          canvasScale,
          offscreenCanvas,
          candlesticks,
        });

        playInfiniteDrawer();

        return () => {
          stopInfiniteDrawer();
        };
      } else {
        const scaledCanvasDrawer = new ScaledCanvasDrawer({
          scale: canvasScale,
          renderingContextProvider,
          candlesticks,
        });

        setScaledCanvasDrawer(scaledCanvasDrawer);

        const infiniteDrawer = new InfiniteDrawer(scaledCanvasDrawer);

        infiniteDrawer.play();

        return () => {
          infiniteDrawer.stop();
        };
      }
    }
  }, [
    candlesticks,
    canvasScale,
    initScaledCanvasDrawer,
    playInfiniteDrawer,
    renderingContextProvider,
    stopInfiniteDrawer,
  ]);

  React.useEffect(() => {
    const tmp = INITIAL_VISIBLE_CANDLES_COUNT * (chartScale - 1);
    const firstVisibleCandleIndex = chartOffset - tmp / 2 + 0;
    const lastVisibleCandleIndex =
      chartOffset + tmp / 2 + INITIAL_VISIBLE_CANDLES_COUNT;

    if (isScaledCanvasDrawerReady) {
      updateScaledCanvasDrawer({
        firstVisibleCandleIndex,
        lastVisibleCandleIndex,
      });
    }

    if (scaledCanvasDrawer) {
      scaledCanvasDrawer.firstVisibleCandleIndex = firstVisibleCandleIndex;
      scaledCanvasDrawer.lastVisibleCandleIndex = lastVisibleCandleIndex;
    }
  }, [
    chartOffset,
    chartScale,
    isScaledCanvasDrawerReady,
    playInfiniteDrawer,
    scaledCanvasDrawer,
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
