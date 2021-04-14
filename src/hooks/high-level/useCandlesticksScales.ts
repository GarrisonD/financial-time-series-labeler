import CandlesticksScalesContext from "contexts/CandlesticksScales";

import useContextSafe from "hooks/low-level/useContextSafe";

const useCandlesticksScales = () => {
  return useContextSafe(CandlesticksScalesContext);
};

export default useCandlesticksScales;
