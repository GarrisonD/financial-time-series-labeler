import { useMemo } from "react";

import useCandlesticksFile from "./useCandlesticksFile";
import useCandlesticksViewPoint from "./useCandlesticksViewPoint";

const useVisibleCandlesticks = () => {
  const { candlesticks } = useCandlesticksFile();
  const viewPoint = useCandlesticksViewPoint();

  return useMemo(() => {
    return candlesticks.slice(
      Math.floor(viewPoint.firstVisibleCandlestickIndex),
      Math.ceil(viewPoint.lastVisibleCandlestickIndex)
    );
  }, [candlesticks, viewPoint]);
};

export default useVisibleCandlesticks;
