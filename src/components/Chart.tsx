import React from "react";
import uPlot from "uplot";

import "uplot/dist/uPlot.min.css";

import data from "./data";

const fmtUSD = (val: number, dec: number) => {
  return "$" + val.toFixed(dec).replace(/\d(?=(\d{3})+(?:\.|$))/g, "$&,");
};

// draws candlestick symbols (expects data in OHLC order)
function candlestickPlugin({
  gap = 2,
  shadowColor = "#000000",
  bearishColor = "#e54245",
  bullishColor = "#4ab650",
  bodyMaxWidth = 20,
  shadowWidth = 2,
  bodyOutline = 1,
} = {}) {
  function drawCandles(u: uPlot) {
    u.ctx.save();

    const offset = (shadowWidth % 2) / 2;

    u.ctx.translate(offset, offset);

    let [iMin, iMax] = u.series[0].idxs!;

    for (let i = iMin; i <= iMax; i++) {
      let xVal = u.scales.x.distr === 2 ? i : u.data[0][i]!;
      let open = u.data[1][i]!;
      let high = u.data[2][i]!;
      let low = u.data[3][i]!;
      let close = u.data[4][i]!;

      let timeAsX = u.valToPos(xVal, "x", true);
      let lowAsY = u.valToPos(low, "y", true);
      let highAsY = u.valToPos(high, "y", true);
      let openAsY = u.valToPos(open, "y", true);
      let closeAsY = u.valToPos(close, "y", true);

      // shadow rect
      let shadowHeight = Math.max(highAsY, lowAsY) - Math.min(highAsY, lowAsY);
      let shadowX = timeAsX - shadowWidth / 2;
      let shadowY = Math.min(highAsY, lowAsY);

      u.ctx.fillStyle = shadowColor;
      u.ctx.fillRect(
        Math.round(shadowX),
        Math.round(shadowY),
        Math.round(shadowWidth),
        Math.round(shadowHeight)
      );

      // body rect
      let columnWidth = u.bbox.width / (iMax - iMin);
      let bodyWidth = Math.min(bodyMaxWidth, columnWidth - gap);
      let bodyHeight =
        Math.max(closeAsY, openAsY) - Math.min(closeAsY, openAsY);
      let bodyX = timeAsX - bodyWidth / 2;
      let bodyY = Math.min(closeAsY, openAsY);
      let bodyColor = open > close ? bearishColor : bullishColor;

      u.ctx.fillStyle = shadowColor;
      u.ctx.fillRect(
        Math.round(bodyX),
        Math.round(bodyY),
        Math.round(bodyWidth),
        Math.round(bodyHeight)
      );

      u.ctx.fillStyle = bodyColor;
      u.ctx.fillRect(
        Math.round(bodyX + bodyOutline),
        Math.round(bodyY + bodyOutline),
        Math.round(bodyWidth - bodyOutline * 2),
        Math.round(bodyHeight - bodyOutline * 2)
      );
    }

    u.ctx.translate(-offset, -offset);

    u.ctx.restore();
  }

  return {
    opts: (_u: uPlot, opts: uPlot.Options) => {
      uPlot.assign(opts, {
        cursor: {
          points: {
            show: false,
          },
        },
      });

      opts.series.forEach((series) => {
        series.paths = () => null;
        series.points = { show: false };
      });
    },
    hooks: {
      draw: [drawCandles],
    },
  };
}

const Chart = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current!;

    const tzDate = (ts: number) => uPlot.tzDate(new Date(ts * 1e3), "Etc/UTC");

    const options = {
      width: container.clientWidth,
      height:
        container.clientHeight -
        27 /* substract height of title */ -
        35 /* substract height of legend */,
      title: "Some title here",
      tzDate,
      plugins: [candlestickPlugin()],
      scales: { x: { distr: 2 as const } },
      series: [
        {
          label: "Date",
          value: (_u: uPlot, ts: number) =>
            uPlot.fmtDate("{YYYY}-{MM}-{DD}")(tzDate(ts)),
        },
        {
          label: "Open",
          value: (_u: uPlot, v: number) => fmtUSD(v, 2),
        },
        {
          label: "High",
          value: (_u: uPlot, v: number) => fmtUSD(v, 2),
        },
        {
          label: "Low",
          value: (_u: uPlot, v: number) => fmtUSD(v, 2),
        },
        {
          label: "Close",
          value: (_u: uPlot, v: number) => fmtUSD(v, 2),
        },
      ],
      axes: [
        {},
        {
          values: (_u: uPlot, vals: number[]) => vals.map((v) => fmtUSD(v, 0)),
        },
      ],
    };

    new uPlot(options, data, container);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        marginBottom: "10px",
        marginTop: "15px",
      }}
    />
  );
};

export default Chart;
