import React from "react";
import * as d3 from "d3";

const INITIAL_FIRST_VISIBLE_CANDLE_INDEX = 0;
const INITIAL_LAST_VISIBLE_CANDLE_INDEX = 9;

const SCROLL_BASE_COEFFICIENT = 0.999;

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
  private xScale: any;

  private candleStickWidth = 0;

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

    this.yScale = d3.scaleLinear().range([height, 0]);
    this.xScale = d3.scaleLinear().range([0, width]);
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

  draw(firstVisibleCandleIndex: number, lastVisibleCandleIndex: number) {
    if (this.context == null) throw CanvasDrawer.CONTEXT_2D_MISSING_MSG;

    const records = this.records.slice(
      Math.max(Math.floor(firstVisibleCandleIndex), 0),
      Math.min(Math.ceil(lastVisibleCandleIndex + 1), this.records.length)
    );

    this.yScale.domain([
      d3.min(records.map((record) => record.Low))!,
      d3.max(records.map((record) => record.High))!,
    ]);

    this.xScale.domain([firstVisibleCandleIndex, lastVisibleCandleIndex + 1]);

    this.candleStickWidth =
      this.width / (lastVisibleCandleIndex - firstVisibleCandleIndex + 1);

    this.context.clearRect(0, 0, this.width, this.height);

    records.forEach((record, i) => {
      this.drawCandleStick(
        record,
        i + Math.max(Math.floor(firstVisibleCandleIndex), 0)
      );
    });
  }

  private drawCandleStick(record: OHLCRecord, i: number) {
    const color = ohlcRecordToColor(record);

    this.drawStick(record, i, color);
    this.drawCandle(record, i, color);
  }

  private drawStick(record: OHLCRecord, i: number, color: string) {
    if (this.context == null) throw CanvasDrawer.CONTEXT_2D_MISSING_MSG;

    this.context.beginPath();

    this.context.moveTo(
      this.xScale(i) + this.candleStickWidth / 2,
      this.yScale(Math.max(record.High, record.Low))
    );

    this.context.lineTo(
      this.xScale(i) + this.candleStickWidth / 2,
      this.yScale(Math.min(record.High, record.Low))
    );

    this.context.strokeStyle = color;

    this.context.stroke();
  }

  private drawCandle(record: OHLCRecord, i: number, color: string) {
    if (this.context == null) throw CanvasDrawer.CONTEXT_2D_MISSING_MSG;

    this.context.beginPath();

    this.context.rect(
      this.xScale(i),
      this.yScale(Math.max(record.Open, record.Close)),
      this.candleStickWidth,
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

    let zoomCoefficient = 1;

    const canvasDrawer = new CanvasDrawer(canvas, width, height, records);

    canvasDrawer.prepare();

    canvasDrawer.draw(
      INITIAL_FIRST_VISIBLE_CANDLE_INDEX,
      INITIAL_LAST_VISIBLE_CANDLE_INDEX
    );

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();

      zoomCoefficient *= SCROLL_BASE_COEFFICIENT ** e.deltaY;

      const tmp =
        (INITIAL_LAST_VISIBLE_CANDLE_INDEX -
          INITIAL_FIRST_VISIBLE_CANDLE_INDEX) *
        (zoomCoefficient - 1);

      canvasDrawer.draw(
        INITIAL_FIRST_VISIBLE_CANDLE_INDEX - tmp / 2,
        INITIAL_LAST_VISIBLE_CANDLE_INDEX + tmp / 2
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
