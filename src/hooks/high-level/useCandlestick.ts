import { useCallback } from "react";

import useCandlesticks from "./useCandlesticks";
import useCandlesticksFile from "./useCandlesticksFile";

const useCandlestick = (index: number) => {
  const { setFile } = useCandlesticksFile();

  const candlesticks = useCandlesticks();
  const candlestick = candlesticks[index];

  const bullish = candlestick.close > candlestick.open;

  const toggleLabeled = useCallback(() => {
    setFile((file) => {
      const { candlesticks, ...rest } = file!;

      const newCandlestick = { ...candlesticks[index] };
      newCandlestick.labeled = !newCandlestick.labeled;

      const newCandlesticks = [...candlesticks];
      newCandlesticks.splice(index, 1, newCandlestick);

      return { candlesticks: newCandlesticks, ...rest };
    });
  }, [index, setFile]);

  return {
    ...candlestick,
    //
    bullish,
    bearish: !bullish,
    //
    toggleLabeled,
  };
};

export default useCandlestick;
