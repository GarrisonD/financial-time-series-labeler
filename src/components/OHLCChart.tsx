import React from "react";
import * as d3 from "d3";

const INITIAL_FIRST_VISIBLE_CANDLE_INDEX = 0;
const INITIAL_LAST_VISIBLE_CANDLE_INDEX = 10;

const INITIAL_VISIBLE_CANDLES_COUNT =
  INITIAL_LAST_VISIBLE_CANDLE_INDEX - INITIAL_FIRST_VISIBLE_CANDLE_INDEX;

const SCROLL_BASE_COEFFICIENT = 0.999;
const SPACE_BETWEEN_CANDLES = 0.5;

const ohlcRecordToColor = (record: OHLCRecord): string => {
  if (record.Open === record.Close) return "silver";
  return record.Open > record.Close ? "red" : "green";
};

class CanvasDrawer {
  static readonly GET_CONTEXT_2D_FAIL_MSG =
    "Getting of 2D Context failed... May your browser not support it?..";

  static readonly CONTEXT_2D_MISSING_MSG =
    "2D Context is missing... I suppose you forget to call #prepare...";

  private canvas: HTMLCanvasElement;
  private context?: CanvasRenderingContext2D;

  private width: number;
  private height: number;

  private records: readonly OHLCRecord[];

  private yScale: any;

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    records: OHLCRecord[]
  ) {
    this.canvas = canvas;

    this.width = width;
    this.height = height;

    this.records = records;

    this.yScale = d3.scaleLinear().range([height, 0]).nice();
  }

  prepare(scale = window.devicePixelRatio) {
    this.canvas.width = this.width * scale;
    this.canvas.height = this.height * scale;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    const context = this.canvas.getContext("2d");

    if (context) {
      this.context = context;
      this.context.scale(scale, scale);
    } else {
      throw CanvasDrawer.GET_CONTEXT_2D_FAIL_MSG;
    }
  }

  draw(
    candleWidth: number,
    firstVisibleCandleIndex: number,
    lastVisibleCandleIndex: number,
    offsetLeft: number = 0
  ) {
    if (this.context == null) throw CanvasDrawer.CONTEXT_2D_MISSING_MSG;

    const records = this.records.slice(
      firstVisibleCandleIndex < 0 ? 0 : firstVisibleCandleIndex,
      lastVisibleCandleIndex
    );

    this.yScale.domain([
      d3.min(records.map((record) => record.Low))!,
      d3.max(records.map((record) => record.High))!,
    ]);

    this.context.clearRect(0, 0, this.width, this.height);

    records.forEach((record, i) => {
      this.drawCandleStick(record, i, candleWidth, offsetLeft);
    });
  }

  private drawCandleStick(
    record: OHLCRecord,
    i: number,
    candleWidth: number,
    offsetLeft: number
  ) {
    const color = ohlcRecordToColor(record);

    this.drawStick(record, i, candleWidth, color, offsetLeft);
    this.drawCandle(record, i, candleWidth, color, offsetLeft);
  }

  private drawStick(
    record: OHLCRecord,
    i: number,
    candleWidth: number,
    color: string,
    offsetLeft: number
  ) {
    if (this.context == null) throw CanvasDrawer.CONTEXT_2D_MISSING_MSG;

    this.context.beginPath();

    this.context.moveTo(
      offsetLeft +
        i * candleWidth * (1 + SPACE_BETWEEN_CANDLES) +
        candleWidth / 2,
      this.yScale(Math.max(record.High, record.Low))
    );

    this.context.lineTo(
      offsetLeft +
        i * candleWidth * (1 + SPACE_BETWEEN_CANDLES) +
        candleWidth / 2,
      this.yScale(Math.min(record.High, record.Low))
    );

    this.context.strokeStyle = color;

    this.context.stroke();
  }

  private drawCandle(
    record: OHLCRecord,
    i: number,
    candleWidth: number,
    color: string,
    offsetLeft: number
  ) {
    if (this.context == null) throw CanvasDrawer.CONTEXT_2D_MISSING_MSG;

    this.context.beginPath();

    this.context.rect(
      offsetLeft + i * candleWidth * (1 + SPACE_BETWEEN_CANDLES),
      this.yScale(Math.max(record.Open, record.Close)),
      candleWidth,
      record.Open === record.Close
        ? 1
        : this.yScale(Math.min(record.Open, record.Close)) -
            this.yScale(Math.max(record.Open, record.Close))
    );

    this.context.fillStyle = color;
    this.context.fill();

    this.context.strokeStyle = "black";
    this.context.stroke();
  }
}

const OHLCChart = ({ records }: OHLCFile) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current!;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const canvas = canvasRef.current!;

    const initialCandleWidth =
      (width - 1) /
      (INITIAL_VISIBLE_CANDLES_COUNT +
        (INITIAL_VISIBLE_CANDLES_COUNT - 1) * SPACE_BETWEEN_CANDLES);

    let zoomCoefficient = 1,
      deltaWidthLeft = 0,
      deltaWidthRight = 0;

    const canvasDrawer = new CanvasDrawer(canvas, width, height, records);

    canvasDrawer.prepare();

    canvasDrawer.draw(
      initialCandleWidth,
      INITIAL_FIRST_VISIBLE_CANDLE_INDEX,
      INITIAL_LAST_VISIBLE_CANDLE_INDEX
    );

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();

      const prevWidth = width * zoomCoefficient;
      zoomCoefficient *= SCROLL_BASE_COEFFICIENT ** e.deltaY;
      const currentWidth = width * zoomCoefficient;

      const deltaWidth = prevWidth - currentWidth;
      deltaWidthLeft += deltaWidth * (e.offsetX / width);
      deltaWidthRight += deltaWidth * (1 - e.offsetX / width);

      const candleWidth = initialCandleWidth * zoomCoefficient;

      const deltaCandlesLeft = Math.ceil(
        (deltaWidthLeft - candleWidth * SPACE_BETWEEN_CANDLES) /
          (candleWidth * (1 + SPACE_BETWEEN_CANDLES))
      );

      const deltaCandlesRight = Math.ceil(
        (deltaWidthRight - candleWidth * SPACE_BETWEEN_CANDLES) /
          (candleWidth * (1 + SPACE_BETWEEN_CANDLES))
      );

      console.log(
        INITIAL_FIRST_VISIBLE_CANDLE_INDEX - deltaCandlesLeft,
        INITIAL_LAST_VISIBLE_CANDLE_INDEX + deltaCandlesRight
      );

      canvasDrawer.draw(
        candleWidth,
        INITIAL_FIRST_VISIBLE_CANDLE_INDEX - deltaCandlesLeft,
        INITIAL_LAST_VISIBLE_CANDLE_INDEX + deltaCandlesRight,
        deltaWidthLeft -
          (deltaCandlesLeft < 0
            ? deltaCandlesLeft * (candleWidth * (1 + SPACE_BETWEEN_CANDLES))
            : 0)
      );
    });
  }, [records]);

  return (
    <div ref={containerRef} style={{ background: "lightgray", flex: 1 }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default React.memo(OHLCChart);
