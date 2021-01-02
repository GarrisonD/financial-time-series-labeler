import { memo, useState } from "react";

import CandlesticksChart from "components/CandlesticksChart";
import CSVUploader from "components/CSVUploader";

import CanvasScaleContext, { DEFAULT_CANVAS_SCALE } from "contexts/CanvasScale";

const App = () => {
  const [
    namedCandlesticks,
    setNamedCandlesticks,
  ] = useState<NamedCandlesticks>();

  return (
    <CanvasScaleContext.Provider value={DEFAULT_CANVAS_SCALE}>
      <div style={{ display: "flex", flex: 1, padding: "10px" }}>
        {namedCandlesticks ? (
          <CandlesticksChart {...namedCandlesticks} />
        ) : (
          <CSVUploader onFileParsed={setNamedCandlesticks} />
        )}
      </div>
    </CanvasScaleContext.Provider>
  );
};

export default memo(App);
