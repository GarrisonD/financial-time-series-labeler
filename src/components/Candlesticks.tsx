import Candlestick from "./Candlestick";

import useVisibleCandlesticks from "hooks/high-level/useVisibleCandlesticks";

const Candlesticks = () => {
  const candlesticks = useVisibleCandlesticks();

  return (
    <>
      {candlesticks.map((candlestick) => (
        <Candlestick key={candlestick.index} index={candlestick.index} />
      ))}
    </>
  );
};

export default Candlesticks;
