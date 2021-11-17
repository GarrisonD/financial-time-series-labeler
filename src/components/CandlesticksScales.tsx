import { ReactNode, useMemo } from "react";

import CandlesticksScalesContext from "contexts/CandlesticksScales";

import useCandlesticksSettings from "hooks/high-level/useCandlesticksSettings";
import useCandlesticksViewPoint from "hooks/high-level/useCandlesticksViewPoint";
import useVisibleCandlesticks from "hooks/high-level/useVisibleCandlesticks";

import usePixiDimensions from "hooks/high-level/usePixiDimensions";

import LinearScale from "utils/linear-scale";

const CandlesticksScales = (props: { children: ReactNode }) => {
  const candlesticks = useVisibleCandlesticks();

  const { height, width } = usePixiDimensions();
  const viewPoint = useCandlesticksViewPoint();

  const { candlestickPlaceholderWidth } = useCandlesticksSettings();

  const xScale = useMemo(() => {
    const xScale = new LinearScale();

    xScale.domain = [
      viewPoint.firstVisibleCandlestickIndex,
      viewPoint.lastVisibleCandlestickIndex,
    ];

    // prettier-ignore
    xScale.range = viewPoint.centered
      ?
        [
          (width - viewPoint.visibleCandlesticksCount * candlestickPlaceholderWidth) / 2,
          (width + viewPoint.visibleCandlesticksCount * candlestickPlaceholderWidth) / 2,
        ]
      : [0, width];

    return xScale;
  }, [candlestickPlaceholderWidth, viewPoint, width]);

  const yScale = useMemo(() => {
    const yScale = new LinearScale();

    yScale.domain = [
      Math.min(...candlesticks.map((candlestick) => candlestick.low)),
      Math.max(...candlesticks.map((candlestick) => candlestick.high)),
    ];

    yScale.range = [height, 0];

    return yScale;
  }, [candlesticks, height]);

  const candlesticksScales = useMemo(() => {
    return { xScale, yScale };
  }, [xScale, yScale]);

  return (
    <CandlesticksScalesContext.Provider value={candlesticksScales}>
      {props.children}
    </CandlesticksScalesContext.Provider>
  );
};

export default CandlesticksScales;
