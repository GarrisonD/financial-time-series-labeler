import { createContext } from "react";

type CandlesticksViewPointContextType = {
  centered: boolean;
  //
  firstVisibleCandlestickIndex: number;
  lastVisibleCandlestickIndex: number;
  //
  maxVisibleCandlesticksCount: number;
  visibleCandlesticksCount: number;
};

const CandlesticksViewPointContext = createContext<
  CandlesticksViewPointContextType | undefined
>(undefined);

CandlesticksViewPointContext.displayName = "CandlesticksViewPointContext";

export default CandlesticksViewPointContext;

export type { CandlesticksViewPointContextType };
