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
  const visibleCandlesticksCount = Math.min(
    maxVisibleCandlesticksCount,
    file.candlesticks.length
  );

  const centered = visibleCandlesticksCount < maxVisibleCandlesticksCount;

  const [firstVisibleCandlestickIndex, setFirstVisibleCandlestickIndex] =
    useState(0);

  useEffect(() => {
    const type = "keydown";

    const listener = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowRight":
          e.preventDefault();
          if (!centered) {
            setFirstVisibleCandlestickIndex(
              (currentFirstVisibleCandlestickIndex) =>
                Math.min(
                  currentFirstVisibleCandlestickIndex + 15,
                  file.candlesticks.length - maxVisibleCandlesticksCount
                )
            );
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (!centered) {
            setFirstVisibleCandlestickIndex(
              (currentFirstVisibleCandlestickIndex) =>
                Math.max(currentFirstVisibleCandlestickIndex - 15, 0)
            );
          }
          break;
        case "KeyS":
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            const data = Papa.unparse(file.candlesticks, {
              columns: "index,timestamp,open,high,low,close,label".split(","),
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
  }, [centered, file.candlesticks, file.name, maxVisibleCandlesticksCount]);

  const candlesticksViewPoint = useMemo(() => {
    const lastVisibleCandlestickIndex =
      firstVisibleCandlestickIndex + visibleCandlesticksCount;

    return {
      centered,
      //
      firstVisibleCandlestickIndex,
      lastVisibleCandlestickIndex,
      //
      maxVisibleCandlesticksCount,
      visibleCandlesticksCount,
    };
  }, [
    centered,
    //
    firstVisibleCandlestickIndex,
    //
    maxVisibleCandlesticksCount,
    visibleCandlesticksCount,
  ]);

  return (
    <CandlesticksViewPointContext.Provider value={candlesticksViewPoint}>
      {props.children}
    </CandlesticksViewPointContext.Provider>
  );
};

export default CandlesticksViewPoint;
