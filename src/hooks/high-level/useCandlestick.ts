import useCandlesticks from "./useCandlesticks";

const useCandlestick = (index: number) => {
  const candlesticks = useCandlesticks();
  const candlestick = candlesticks[index];

  const isBullish = candlestick.close > candlestick.open;

  return { ...candlestick, isBullish, isBearish: !isBullish };
};

export default useCandlestick;
