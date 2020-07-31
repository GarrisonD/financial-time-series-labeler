import React from "react";

import CandlesticksChart from "components/CandlesticksChart";
import CSVUploader from "components/CSVUploader";

const App = () => {
  const [namedCandlesticks, setNamedCandlesticks] = React.useState<
    NamedCandlesticks
  >();

  return (
    <div style={{ display: "flex", flex: 1, padding: "10px" }}>
      {namedCandlesticks ? (
        <CandlesticksChart {...namedCandlesticks} />
      ) : (
        <CSVUploader onFileParsed={setNamedCandlesticks} />
      )}
    </div>
  );
};

export default React.memo(App);
