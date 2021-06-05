import { memo, useState } from "react";

import CandlesticksChart from "components/CandlesticksChart";
import CSVUploader from "components/CSVUploader";

const App = () => {
  const [namedCandlesticks, setNamedCandlesticks] =
    useState<NamedCandlesticks>();

  return (
    <div style={{ display: "flex", flex: 1, padding: 10 }}>
      {namedCandlesticks ? (
        <CandlesticksChart {...namedCandlesticks} />
      ) : (
        <CSVUploader onFileParsed={setNamedCandlesticks} />
      )}
    </div>
  );
};

export default memo(App);
