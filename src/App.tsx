import { memo, useState } from "react";

import CandlesticksChart from "components/CandlesticksChart";
import CandlesticksSettings from "components/CandlesticksSettings";

import CSVUploader from "components/CSVUploader";

import NamedCandlesticksContext from "contexts/NamedCandlesticks";

import * as NamedCandlesticks from "utils/named-candlesticks";

const App = () => {
  const [namedCandlesticks, setNamedCandlesticks] = useState<NamedCandlesticks>(
    NamedCandlesticks.Dummy.Set2
  );

  return (
    <CandlesticksSettings>
      <div style={{ display: "flex", flex: 1, padding: 10 }}>
        {namedCandlesticks ? (
          <NamedCandlesticksContext.Provider value={namedCandlesticks}>
            <CandlesticksChart />
          </NamedCandlesticksContext.Provider>
        ) : (
          <CSVUploader onFileParsed={setNamedCandlesticks} />
        )}
      </div>
    </CandlesticksSettings>
  );
};

export default memo(App);
