import { ReactNode, useEffect, useMemo, useState } from "react";

import CandlesticksViewPointContext from "contexts/CandlesticksViewPoint";

import useCandlesticks from "hooks/high-level/useCandlesticks";
import useCandlesticksSettings from "hooks/high-level/useCandlesticksSettings";

import usePixiDimensions from "hooks/high-level/usePixiDimensions";

const CandlesticksViewPoint = (props: { children: ReactNode }) => {
  const candlesticks = useCandlesticks();

  const { width } = usePixiDimensions();

  const { candlestickPlaceholderWidth } = useCandlesticksSettings();
  const maxVisibleCandlesticksCount = width / candlestickPlaceholderWidth;

  const [firstVisibleCandlestickIndex, setFirstVisibleCandlestickIndex] =
    useState(0);

  useEffect(() => {
    const type = "keydown";

    const listener = (e: KeyboardEvent) => {
      setFirstVisibleCandlestickIndex((firstVisibleCandlestickIndex) => {
        switch (e.code) {
          case "ArrowRight":
            return firstVisibleCandlestickIndex + 15;
          case "ArrowLeft":
            return firstVisibleCandlestickIndex - 15;
          default:
            return firstVisibleCandlestickIndex;
        }
      });
    };

    window.addEventListener(type, listener);

    return () => {
      window.removeEventListener(type, listener);
    };
  }, []);

  const candlesticksViewPoint = useMemo(() => {
    const visibleCandlesticksCount = Math.min(
      maxVisibleCandlesticksCount,
      candlesticks.length
    );

    const lastVisibleCandlestickIndex =
      firstVisibleCandlestickIndex + visibleCandlesticksCount;

    return {
      firstVisibleCandlestickIndex,
      lastVisibleCandlestickIndex,
      //
      maxVisibleCandlesticksCount,
    };
  }, [
    candlesticks.length,
    firstVisibleCandlestickIndex,
    maxVisibleCandlesticksCount,
  ]);

  return (
    <CandlesticksViewPointContext.Provider value={candlesticksViewPoint}>
      {props.children}
    </CandlesticksViewPointContext.Provider>
  );
};

export default CandlesticksViewPoint;
