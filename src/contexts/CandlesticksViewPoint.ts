import { createContext } from "react";

type CandlesticksViewPointContextType = {
  firstVisibleCandlestickIndex: number;
  lastVisibleCandlestickIndex: number;
  //
  maxVisibleCandlesticksCount: number;
};

const CandlesticksViewPointContext = createContext<
  CandlesticksViewPointContextType | undefined
>(undefined);

CandlesticksViewPointContext.displayName = "CandlesticksViewPointContext";

export default CandlesticksViewPointContext;
