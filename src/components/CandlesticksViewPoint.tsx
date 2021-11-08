import { ReactNode, useEffect, useMemo, useState } from "react";
import { saveAs } from "file-saver";
import Papa from "papaparse";

import CandlesticksViewPointContext from "contexts/CandlesticksViewPoint";

import useCandlesticksFile from "hooks/high-level/useCandlesticksFile";
import useCandlesticksSettings from "hooks/high-level/useCandlesticksSettings";

import usePixiDimensions from "hooks/high-level/usePixiDimensions";

const CandlesticksViewPoint = (props: { children: ReactNode }) => {
  const { file } = useCandlesticksFile();

  const { width } = usePixiDimensions();
  const { candlestickPlaceholderWidth } = useCandlesticksSettings();
  const maxVisibleCandlesticksCount = width / candlestickPlaceholderWidth;

  const [firstVisibleCandlestickIndex, setFirstVisibleCandlestickIndex] =
    useState(0);

  useEffect(() => {
    const type = "keydown";

    const listener = (e: KeyboardEvent) => {
      e.preventDefault();

      switch (e.code) {
        case "ArrowRight":
          setFirstVisibleCandlestickIndex((index) => index + 15);
          break;
        case "ArrowLeft":
          setFirstVisibleCandlestickIndex((index) => index - 15);
          break;
        case "KeyS":
          if (e.ctrlKey || e.metaKey) {
            const data = Papa.unparse(file.candlesticks, {
              columns: "index,timestamp,open,high,low,close,labeled".split(","),
            });
            const blob = new Blob([data], { type: "text/csv" });
            saveAs(blob, file.name);
          }
          break;
      }
    };

    window.addEventListener(type, listener);

    return () => {
      window.removeEventListener(type, listener);
    };
  }, [file.candlesticks, file.name]);

  const candlesticksViewPoint = useMemo(() => {
    const visibleCandlesticksCount = Math.min(
      maxVisibleCandlesticksCount,
      file.candlesticks.length
    );

    const lastVisibleCandlestickIndex =
      firstVisibleCandlestickIndex + visibleCandlesticksCount;

    return {
      firstVisibleCandlestickIndex,
      lastVisibleCandlestickIndex,
      //
      maxVisibleCandlesticksCount,
    };
  }, [
    file.candlesticks.length,
    firstVisibleCandlestickIndex,
    maxVisibleCandlesticksCount,
  ]);

  return (
    <CandlesticksViewPointContext.Provider value={candlesticksViewPoint}>
      {props.children}
    </CandlesticksViewPointContext.Provider>
  );
};

export default CandlesticksViewPoint;
