import { memo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import CandlesticksChart from "components/CandlesticksChart";
import CandlesticksSettings from "components/CandlesticksSettings";

import CSVUploader from "components/CSVUploader";

import CandlesticksFileContext from "contexts/CandlesticksFile";

const App = () => {
  const [candlesticksFile, setCandlesticksFile] = useState<CandlesticksFile>();

  return (
    <>
      <CssBaseline />

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
    </>
  );
};

export default memo(App);
