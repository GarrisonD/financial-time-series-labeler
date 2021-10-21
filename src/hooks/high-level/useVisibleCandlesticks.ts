import { useMemo } from "react";

import useCandlesticksViewPoint from "./useCandlesticksViewPoint";
import useNamedCandlesticks from "./useNamedCandlesticks";

const useVisibleCandlesticks = () => {
  const { candlesticks } = useNamedCandlesticks();
  const viewPoint = useCandlesticksViewPoint();

  return useMemo(() => {
    return candlesticks.slice(
      Math.floor(viewPoint.firstVisibleCandlestickIndex),
      Math.ceil(viewPoint.lastVisibleCandlestickIndex)
    );
  }, [candlesticks, viewPoint]);
};

export default useVisibleCandlesticks;
