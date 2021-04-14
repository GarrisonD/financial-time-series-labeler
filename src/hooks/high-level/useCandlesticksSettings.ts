import CandlesticksSettingsContext from "contexts/CandlesticksSettings";

import useContextSafe from "hooks/low-level/useContextSafe";

const useCandlesticksSettings = () => {
  return useContextSafe(CandlesticksSettingsContext);
};

export default useCandlesticksSettings;
