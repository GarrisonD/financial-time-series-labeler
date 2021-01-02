import { memo, useCallback } from "react";

import Papa from "papaparse";

import Dropzone from "./Dropzone";

const CSVUploader = ({
  onFileParsed,
}: {
  onFileParsed: (file: NamedCandlesticks) => void;
}) => {
  const handleParseComplete = useCallback<
    Required<Papa.ParseConfig<Candlestick>>["complete"]
  >(
    (result, file) => {
      if (result.errors.length > 0) {
        console.error(file!.name, result.errors);
        alert("Errors while parsing! Check dev console!");
      }

      onFileParsed({ name: file!.name, candlesticks: result.data });
    },
    [onFileParsed]
  );

  const handleDrop = useCallback(
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

  return <Dropzone accept=".csv" onDropAccepted={handleDrop} />;
};

export default memo(CSVUploader);
