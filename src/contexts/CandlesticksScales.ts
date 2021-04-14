import { createContext } from "react";

import LinearScale from "utils/linear-scale";

type CandlesticksScalesContextType = {
  xScale: LinearScale;
  yScale: LinearScale;
};

const CandlesticksScalesContext = createContext<
  CandlesticksScalesContextType | null | undefined
>(undefined);

CandlesticksScalesContext.displayName = "CandlesticksScalesContext";

export default CandlesticksScalesContext;
