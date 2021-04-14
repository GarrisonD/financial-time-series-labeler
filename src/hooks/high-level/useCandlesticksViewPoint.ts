import CandlesticksViewPointContext from "contexts/CandlesticksViewPoint";

import useContextSafe from "hooks/low-level/useContextSafe";

const useCandlesticksViewPoint = () => {
  return useContextSafe(CandlesticksViewPointContext);
};

export default useCandlesticksViewPoint;
