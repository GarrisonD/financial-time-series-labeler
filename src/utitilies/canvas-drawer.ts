import { scaleLinear } from "d3-scale";

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

  public xScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;

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

    this.xScale = scaleLinear().range([0, width]);
    this.yScale = scaleLinear().range([height, 0]);
  }

  prepare({ scale } = { scale: window.devicePixelRatio }) {
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
      Math.min(...records.map((record) => record.Low)),
      Math.max(...records.map((record) => record.High)),
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
    this.drawCandle(record, i);
    this.drawStick(record, i);
  }

  private drawStick(record: OHLCRecord, i: number) {
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

    this.context.strokeStyle = ohlcRecordToColor(record);

    this.context.stroke();
  }

  private drawCandle(record: OHLCRecord, i: number) {
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

    this.context.fillStyle = ohlcRecordToColor(record);
    this.context.fill();

    this.context.strokeStyle = "white";
    this.context.stroke();
  }
}

export default CanvasDrawer;
