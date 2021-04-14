import NamedCandlesticksContext from "contexts/NamedCandlesticks";

import useContextSafe from "hooks/low-level/useContextSafe";

const useNamedCandlesticks = () => {
  return useContextSafe(NamedCandlesticksContext);
};

export default useNamedCandlesticks;
