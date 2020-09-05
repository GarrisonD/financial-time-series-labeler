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

const CandlesticksChart = ({ candlesticks }: NamedCandlesticks) => {
  const [containerRef, containerDimensions] = useDimensions<HTMLDivElement>();

  const [
    renderingContextProvider,
    setRenderingContextProvider,
  ] = React.useState<RenderingContextProvider>();

  const [chartOffset, changeChartOffsetBy] = useOffset();
  const [chartScale, changeChartScaleBy] = useScale();

  const canvasScale = React.useContext(CanvasScaleContext);

  const { init } = useInfiniteDrawerWorker();

  React.useEffect(() => {
    if (containerDimensions) {
      if (renderingContextProvider instanceof OffscreenCanvas) {
        init({
          candlesticks,
          scale: canvasScale,
          renderingContextProvider,
          ...containerDimensions,
        });
      }
    }
  }, [
    candlesticks,
    canvasScale,
    containerDimensions,
    init,
    renderingContextProvider,
  ]);

  if (candlesticks && chartOffset) {
  }

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
