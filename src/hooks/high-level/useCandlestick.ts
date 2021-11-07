import useCandlesticksFile from "./useCandlesticksFile";

const useCandlestick = (index: number) => {
  const { candlesticks } = useCandlesticksFile();
  const candlestick = candlesticks[index];

  const isBullish = candlestick.close > candlestick.open;

  return { ...candlestick, isBullish, isBearish: !isBullish };
};

export default useCandlestick;
