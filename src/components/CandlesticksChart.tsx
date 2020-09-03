import React from "react";

import CanvasOnSteroids, {
  CanvasOnSteroidsProps,
  ScaledRenderingContextProvider,
} from "./CanvasOnSteroids";

import useDimensions from "hooks/useDimensions";
import useInfiniteDrawerWorker from "hooks/useInfiniteDrawerWorker";

import useOffset from "hooks/charting/useOffset";
import useScale from "hooks/charting/useScale";

const CandlesticksChart = ({ candlesticks }: NamedCandlesticks) => {
  const [containerRef, containerDimensions] = useDimensions<HTMLDivElement>();

  const [
    scaledRenderingContextProvider,
    setScaledRenderingContextProvider,
  ] = React.useState<ScaledRenderingContextProvider>();

  const [offset, changeOffsetBy] = useOffset();
  const [scale, changeScaleBy] = useScale();

  const { init } = useInfiniteDrawerWorker();

  React.useEffect(() => {
    if (containerDimensions) {
      if (scaledRenderingContextProvider instanceof OffscreenCanvas) {
        init({
          candlesticks,
          scale: scaledRenderingContextProvider.scale,
          scaledRenderingContextProvider,
          ...containerDimensions,
        });
      }
    }
  }, [candlesticks, containerDimensions, init, scaledRenderingContextProvider]);

  if (candlesticks && offset) {
  }

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
          onScaledRenderingContextProviderReady={
            setScaledRenderingContextProvider
          }
          onWheel={handleCanvasOnSteroidsWheel}
        />
      )}
    </div>
  );
};

export default React.memo(CandlesticksChart);
