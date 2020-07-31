import React from "react";
import Papa from "papaparse";

import Dropzone from "./Dropzone";

const CSVUploader = ({
  onFileParsed,
}: {
  onFileParsed: (file: OHLCFile) => void;
}) => {
  const handleParseComplete = React.useCallback<
    Required<Papa.ParseConfig<Candlestick>>["complete"]
  >(
    (result, file) => {
      if (result.errors.length > 0) {
        console.log(file!.name, result.errors);
        alert("Errors while parsing! Check dev console!");
      }

      onFileParsed({ name: file!.name, records: result.data });
    },
    [onFileParsed]
  );

  const handleDrop = React.useCallback(
    (files: File[]) => {
      // for now it's assumed that only one
      // CSV file is being uploaded at once
      const file = files[0];

      Papa.parse<Candlestick>(file, {
        complete: handleParseComplete,
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
      });
    },
    [handleParseComplete]
  );

  return <Dropzone onDropAccepted={handleDrop} />;
};

export default React.memo(CSVUploader);
