import { createContext } from "react";

type CandlesticksSettingsContextType = {
  candlestickPlaceholderWidth: number;
};

const DEFAULT_VALUE: CandlesticksSettingsContextType = {
  candlestickPlaceholderWidth: 6,
};

const CandlesticksSettingsContext =
  createContext<CandlesticksSettingsContextType>(DEFAULT_VALUE);

CandlesticksSettingsContext.displayName = "CandlesticksSettingsContext";

export default CandlesticksSettingsContext;

export { DEFAULT_VALUE };
