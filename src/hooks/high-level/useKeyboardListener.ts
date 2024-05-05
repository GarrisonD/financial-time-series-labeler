import React, { useCallback, useEffect } from "react";

import { saveAs } from "file-saver";
import Papa from "papaparse";

import uPlot from "uplot";

import useCandlesticksFile from "hooks/high-level/useCandlesticksFile";

const TYPE = "keydown";
const STEP = 15;

const useKeyboardListener = (plotRef: React.RefObject<uPlot | undefined>) => {
  const { file } = useCandlesticksFile();
  const { candlesticks } = file;

  const listener = useCallback(
    (e: KeyboardEvent) => {
      const plot = plotRef.current!;
      const scale = plot.scales.x;

      switch (e.code) {
        case "ArrowRight":
          e.preventDefault();

          if (scale.min != null && scale.max != null) {
            const max = Math.min(scale.max + STEP, candlesticks.length - 1);
            const min = scale.min + (max - scale.max);
            plot.setScale("x", { min, max });
          }

          break;
        case "ArrowLeft":
          e.preventDefault();

          if (scale.min != null && scale.max != null) {
            const min = Math.max(0, scale.min - STEP);
            const max = scale.max - (scale.min - min);
            plot.setScale("x", { min, max });
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
    },
    [candlesticks.length, file.candlesticks, file.name, plotRef],
  );

  useEffect(() => {
    window.addEventListener(TYPE, listener);

    return () => {
      window.removeEventListener(TYPE, listener);
    };
  }, [listener]);
};

export default useKeyboardListener;
