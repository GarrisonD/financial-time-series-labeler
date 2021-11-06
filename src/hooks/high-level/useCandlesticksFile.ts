import CandlesticksFileContext from "contexts/CandlesticksFile";

import useContextSafe from "hooks/low-level/useContextSafe";

const useCandlesticksFile = () => {
  return useContextSafe(CandlesticksFileContext);
};

export default useCandlesticksFile;
