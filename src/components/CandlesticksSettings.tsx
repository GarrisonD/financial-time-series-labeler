import { ReactNode } from "react";

import CandlesticksSettingsContext from "contexts/CandlesticksSettings";
import { DEFAULT_VALUE } from "contexts/CandlesticksSettings";

const CandlesticksSettings = (props: { children: ReactNode }) => {
  return (
    <CandlesticksSettingsContext.Provider value={DEFAULT_VALUE}>
      {props.children}
    </CandlesticksSettingsContext.Provider>
  );
};

export default CandlesticksSettings;
