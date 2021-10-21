import { createContext } from "react";

const NamedCandlesticksContext = createContext<NamedCandlesticks | undefined>(
  undefined
);

NamedCandlesticksContext.displayName = "NamedCandlesticksContext";

export default NamedCandlesticksContext;
