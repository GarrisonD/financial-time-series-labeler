import { memo, useEffect, useRef, useState } from "react";

import uPlot from "uplot";

import LabelPicker from "./LabelPicker";

import useCandlestick from "hooks/high-level/useCandlestick";
import useCandlesticks from "hooks/high-level/useCandlesticks";

import useCandlesticksSettings from "hooks/high-level/useCandlesticksSettings";

import useKeyboardListener from "hooks/high-level/useKeyboardListener";

import useLabelPickerProps from "hooks/high-level/useLabelPickerProps";

import * as plugins from "utils/uplot/plugins";

const CandlesticksChart = () => {
  const plotRef = useRef<uPlot>();
  const divRef = useRef<HTMLDivElement>(null);

  const candlesticks = useCandlesticks();

  const [candlestickIndex, setCandlestickIndex] = useState<number>(0);
  const candlestick = useCandlestick(candlestickIndex);
  const labelPickerProps = useLabelPickerProps();

  const { candlestickPlaceholderWidth } = useCandlesticksSettings();

  useEffect(
    () => {
      if (!divRef.current) return;

      const maxVisibleCandlesticksCount = Math.floor(
        divRef.current.clientWidth / candlestickPlaceholderWidth,
      );

      const opts: uPlot.Options = {
        height: divRef.current.clientHeight,
        width: divRef.current.clientWidth,
        plugins: [plugins.candlestick()],
        legend: { show: false },
        scales: {
          x: {
            // not all markets work 24/7 thus there are gaps
            // in the data. on the chart we don't need that.
            // distr: 2 (ordinal) solves that as well but
            // then user can't scroll freely...
            time: false,

            min:
              candlesticks.length < maxVisibleCandlesticksCount
                ? -(maxVisibleCandlesticksCount - candlesticks.length) / 2
                : 0,
            max:
              candlesticks.length < maxVisibleCandlesticksCount
                ? (maxVisibleCandlesticksCount - candlesticks.length) / 2
                : maxVisibleCandlesticksCount,
          },
        },
        series: [{ label: "Index" }, { label: "Close" }],
        axes: [
          {
            show: false,
            grid: { show: false },
            ticks: { show: false },
          },
          {
            show: false,
            side: 1, // right
            grid: { show: false },
            ticks: { show: false },
          },
        ],
        cursor: {
          bind: {
            // got rid of the default logic to
            // reset X scale on double click:
            dblclick: () => () => null,

            mouseup: (u, _, handler) => {
              return (e) => {
                const idx = u.cursor.idx;

                if (idx != null) {
                  setCandlestickIndex(idx);

                  labelPickerProps.openAt({
                    top: e.clientY,
                    left: e.clientX,
                  });
                }

                handler(e);
                return null;
              };
            },
          },
          drag: {
            x: false,
            y: false,
          },
        },
      };

      const plot = (plotRef.current = new uPlot(opts, [], divRef.current));

      return () => {
        plot.destroy();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [candlestickPlaceholderWidth, candlesticks.length, labelPickerProps.openAt],
  );

  useEffect(() => {
    // prettier-ignore
    const data: uPlot.AlignedData = [
      candlesticks.map((_, i) => {
        // distr: 2 (ordinal) in example,
        // but can't scroll freely then...
        //
        // const date = new Date(timestamp);
        // const ms = date.getTime();
        // return ms;

        return i;
      }),
      candlesticks.map(({ open  }) => open ),
      candlesticks.map(({ high  }) => high ),
      candlesticks.map(({ low   }) => low  ),
      candlesticks.map(({ close }) => close),

      candlesticks.map(({ label }) => label ? 1 : 0)
    ];

    plotRef.current!.setData(data, false);
    plotRef.current!.redraw(false, true);
  }, [candlesticks]);

  useKeyboardListener(plotRef);

  return (
    <>
      <div ref={divRef} style={{ border: "1px solid black", flex: 1 }} />

      {labelPickerProps.position ? (
        <LabelPicker
          value={candlestick.label}
          onChange={candlestick.setLabel}
          //
          onClose={labelPickerProps.onClose}
          position={labelPickerProps.position}
        />
      ) : null}
    </>
  );
};

export default memo(CandlesticksChart);
