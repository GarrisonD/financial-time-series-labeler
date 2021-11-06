import { createContext } from "react";

const CandlesticksFileContext = createContext<CandlesticksFile | undefined>(
  undefined
);

CandlesticksFileContext.displayName = "CandlesticksFileContext";

export default CandlesticksFileContext;
