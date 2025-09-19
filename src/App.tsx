import { memo, useState } from "react";

import CSVUploader from "components/CSVUploader";
import CandlesticksChart from "components/CandlesticksChart";
import CandlesticksSettings from "components/CandlesticksSettings";

import CandlesticksFileContext from "contexts/CandlesticksFile";

const App = () => {
  const [candlesticksFile, setCandlesticksFile] = useState<CandlesticksFile>();

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <CandlesticksSettings>
        <div style={{ display: "flex", flex: 1, padding: 10 }}>
          {candlesticksFile ? (
            <CandlesticksFileContext.Provider
              value={{
                file: candlesticksFile,
                setFile: setCandlesticksFile,
              }}
            >
              <CandlesticksChart />
            </CandlesticksFileContext.Provider>
          ) : (
            <CSVUploader onFileParsed={setCandlesticksFile} />
          )}
        </div>
      </CandlesticksSettings>
    </div>
  );
};

export default memo(App);
