import React from "react";
import * as d3 from "d3";

const CANDLES_INNER_PADDING = 0.5;
let VISIBLE_CANDLES_COUNT = 10;

const ohlcRecordToColor = (record: OHLCRecord): string => {
  if (record.Open === record.Close) return "silver";
  return record.Open > record.Close ? "red" : "green";
};

const OHLCChart = ({ records }: OHLCFile) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current!;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const canvas = canvasRef.current!;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d")!;
    context.scale(window.devicePixelRatio, window.devicePixelRatio);

    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([
        d3.min(records.map((record) => record.Low))!,
        d3.max(records.map((record) => record.High))!,
      ])
      .nice();

    // `ww` is for `window width`
    // `cw` is for `candle width`
    // `cp` is for `candle padding`
    // ww - 1 = N * cw + (N - 1) * cp * cw
    // ww - 1 = (N + (N - 1) * cp) * cw
    // cw = (w - 1) / (N + (N - 1) * cp)
    let bandwidth =
      (width - 1) /
      (VISIBLE_CANDLES_COUNT +
        (VISIBLE_CANDLES_COUNT - 1) * CANDLES_INNER_PADDING);

    let candlesCount = VISIBLE_CANDLES_COUNT;

    const draw = () => {
      context.clearRect(0, 0, width, height);

      records.slice(0, candlesCount).forEach((record, i) => {
        context.beginPath();

        context.moveTo(
          i * bandwidth * (1 + CANDLES_INNER_PADDING) + bandwidth / 2,
          yScale(Math.max(record.High, record.Low))
        );

        context.lineTo(
          i * bandwidth * (1 + CANDLES_INNER_PADDING) + bandwidth / 2,
          yScale(Math.min(record.High, record.Low))
        );

        context.strokeStyle = ohlcRecordToColor(record);

        context.stroke();

        context.beginPath();

        context.rect(
          i * bandwidth * (1 + CANDLES_INNER_PADDING),
          yScale(Math.max(record.Open, record.Close)),
          bandwidth,
          record.Open === record.Close
            ? 1
            : yScale(Math.min(record.Open, record.Close)) -
                yScale(Math.max(record.Open, record.Close))
        );

        context.fillStyle = ohlcRecordToColor(record);
        context.fill();

        context.strokeStyle = "black";
        context.stroke();
      });
    };

    draw();

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();

      bandwidth = bandwidth * 0.99 ** e.deltaY;
      candlesCount = Math.ceil((width - 1) / bandwidth);

      draw();
    });
  }, [records]);

  return (
    <div ref={containerRef} style={{ background: "lightgray", flex: 1 }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default React.memo(OHLCChart);
