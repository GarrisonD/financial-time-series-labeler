import React from "react";
import Papa from "papaparse";

import Dropzone from "./Dropzone";

type OHLCRecord = {
  Timestamp: string;

  Open: number;
  High: number;
  Low: number;
  Close: number;

  Volume: number;
};

const ChartPane = () => {
  const [data, setData] = React.useState<OHLCRecord[]>();

  const handleParseComplete = React.useCallback<
    Required<Papa.ParseConfig<OHLCRecord>>["complete"]
  >((result, file) => {
    if (result.errors.length > 0) {
      console.log(file?.name, result.errors);
      alert("Errors while parsing! Check dev console!");
    }

    setData(result.data);
  }, []);

  const handleDrop = React.useCallback(
    (files: File[]) => {
      const file = files[0]; // for now it's assumed that only one file is being uploaded at once

      Papa.parse<OHLCRecord>(file, {
        complete: handleParseComplete,
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
      });
    },
    [handleParseComplete]
  );

  return (
    <div style={{ display: "flex", flex: 1, margin: "10px" }}>
      {data ? data.length : <Dropzone onDropAccepted={handleDrop} />}
    </div>
  );
};

export default React.memo(ChartPane);
