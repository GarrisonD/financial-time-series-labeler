import { useMemo } from "react";

import useCandlesticks from "./useCandlesticks";
import useCandlesticksViewPoint from "./useCandlesticksViewPoint";

const useVisibleCandlesticks = () => {
  const candlesticks = useCandlesticks();
  const viewPoint = useCandlesticksViewPoint();

  return useMemo(() => {
    return candlesticks.slice(
      Math.floor(viewPoint.firstVisibleCandlestickIndex),
      Math.ceil(viewPoint.lastVisibleCandlestickIndex),
    );
  }, [candlesticks, viewPoint]);
};

export default useVisibleCandlesticks;
