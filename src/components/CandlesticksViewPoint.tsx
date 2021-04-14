import { ReactNode, useMemo } from "react";

import CandlesticksViewPointContext from "contexts/CandlesticksViewPoint";

import useNamedCandlesticks from "hooks/high-level/useNamedCandlesticks";
import useCandlesticksSettings from "hooks/high-level/useCandlesticksSettings";

import usePixiDimensions from "hooks/high-level/usePixiDimensions";

const CandlesticksViewPoint = (props: { children: ReactNode }) => {
  const { candlesticks } = useNamedCandlesticks();

  const { width } = usePixiDimensions();
  const { candlestickPlaceholderWidth } = useCandlesticksSettings();
  const maxVisibleCandlesticksCount = width / candlestickPlaceholderWidth;

  const candlesticksViewPoint = useMemo(() => {
    const visibleCandlesticksCount = Math.min(
      maxVisibleCandlesticksCount,
      candlesticks.length
    );

    const firstVisibleCandlestickIndex = 0;
    const lastVisibleCandlestickIndex =
      firstVisibleCandlestickIndex + visibleCandlesticksCount;

    return {
      firstVisibleCandlestickIndex,
      lastVisibleCandlestickIndex,
      //
      maxVisibleCandlesticksCount,
    };
  }, [maxVisibleCandlesticksCount, candlesticks]);

  return (
    <CandlesticksViewPointContext.Provider value={candlesticksViewPoint}>
      {props.children}
    </CandlesticksViewPointContext.Provider>
  );
};

export default CandlesticksViewPoint;
