import React from "react";

import OHLCChart from "components/OHLCChart";
import CSVUploader from "components/CSVUploader";

const App = () => {
  const [ohlcFile, setOHLCFile] = React.useState<NamedCandlesticks>();

  return (
    <div style={{ display: "flex", flex: 1, padding: "10px" }}>
      {ohlcFile ? (
        <OHLCChart {...ohlcFile} />
      ) : (
        <CSVUploader onFileParsed={setOHLCFile} />
      )}
    </div>
  );
};

export default React.memo(App);
