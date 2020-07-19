import React from "react";
import uPlot from "uplot";

import "uplot/dist/uPlot.min.css";

const tzDate = (timestamp: number) => new Date(timestamp * 1e3);

// draws candlestick symbols (expects data in OHLC format)
const candlestickPlugin = ({
  gap = 2,
  shadowColor = "#000000",
  bearishColor = "#e54245",
  bullishColor = "#4ab650",
  bodyMaxWidth = 20,
  shadowWidth = 2,
  bodyOutline = 1,
} = {}) => {
  const drawCandles = (u: uPlot) => {
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
  };

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
};

const wheelZoomPlugin = ({ factor = 0.95 } = {}) => {
  function clamp(
    nRange: number,
    nMin: number,
    nMax: number,
    fRange: number,
    fMin: number,
    fMax: number
  ) {
    if (nRange > fRange) {
      nMin = fMin;
      nMax = fMax;
    } else if (nMin < fMin) {
      nMin = fMin;
      nMax = fMin + nRange;
    } else if (nMax > fMax) {
      nMax = fMax;
      nMin = fMax - nRange;
    }

    return [nMin, nMax];
  }

  return {
    hooks: {
      ready: [
        (u: uPlot) => {
          const xMin = u.scales.x.min!;
          const xMax = u.scales.x.max!;
          const yMin = u.scales.y.min!;
          const yMax = u.scales.y.max!;

          const xRange = xMax - xMin;
          const yRange = yMax - yMin;

          let plot = u.root.querySelector(".over")!;
          let rect = plot.getBoundingClientRect();

          plot.addEventListener("wheel", (e) => {
            e.preventDefault();

            let { left, top } = u.cursor;

            let leftPct = left! / rect.width;
            let btmPct = 1 - top! / rect.height;
            let xVal = u.posToVal(left!, "x");
            let yVal = u.posToVal(top!, "y");

            let oxRange = u.scales.x.max! - u.scales.x.min!;
            let oyRange = u.scales.y.max! - u.scales.y.min!;

            let nxRange =
              (e as WheelEvent).deltaY < 0
                ? oxRange * factor
                : oxRange / factor;
            let nxMin = xVal - leftPct * nxRange;
            let nxMax = nxMin + nxRange;
            console.log("Before clamp", nxMin, nxMax);
            [nxMin, nxMax] = clamp(nxRange, nxMin, nxMax, xRange, xMin, xMax);
            console.log("After clamp", nxMin, nxMax);

            let nyRange = oyRange;
            let nyMin = yVal - btmPct * nyRange;
            let nyMax = nyMin + nyRange;
            [nyMin, nyMax] = clamp(nyRange, nyMin, nyMax, yRange, yMin, yMax);

            u.batch(() => {
              u.setScale("x", { min: nxMin, max: nxMax });
              u.setScale("y", { min: nyMin, max: nyMax });
            });
          });
        },
      ],
    },
  };
};

const OHLCChart = ({ name: title, records }: OHLCFile) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current!;

    const options = {
      width: container.clientWidth,
      height:
        container.clientHeight -
        27 /* substract height of title */ -
        35 /* substract height of legend */,
      title,
      tzDate,
      plugins: [candlestickPlugin(), wheelZoomPlugin()],
      scales: { x: { distr: 2 as const } },
      series: [
        {
          label: "Timestamp",
          value: (_u: uPlot, timestamp: number) =>
            tzDate(timestamp).toLocaleString("en-GB", { timeZone: "Etc/UTC" }),
        },
        { label: "Open" },
        { label: "High" },
        { label: "Low" },
        { label: "Close" },
      ],
    };

    new uPlot(
      options,
      [
        records.map((value) => value.Timestamp),
        records.map((value) => value.Open),
        records.map((value) => value.High),
        records.map((value) => value.Low),
        records.map((value) => value.Close),
      ],
      container
    );
  }, [records, title]);

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

export default React.memo(OHLCChart);
