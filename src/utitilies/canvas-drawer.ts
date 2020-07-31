import { scaleLinear } from "d3-scale";

const candlestickToColor = (candlestick: Candlestick): string => {
  if (candlestick.Open === candlestick.Close) return "silver";
  return candlestick.Open > candlestick.Close ? "red" : "green";
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

  private candlesticks: readonly Candlestick[];

  public xScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;

  private candleStickWidth = 0;

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    candlesticks: Candlestick[]
  ) {
    this.canvas = canvas;

    this.width = width;
    this.height = height;

    this.candlesticks = candlesticks;

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

    const candlesticks = this.candlesticks.slice(
      Math.max(Math.floor(firstVisibleCandleIndex), 0),
      Math.min(Math.ceil(lastVisibleCandleIndex + 1), this.candlesticks.length)
    );

    this.yScale.domain([
      Math.min(...candlesticks.map((candlestick) => candlestick.Low)),
      Math.max(...candlesticks.map((candlestick) => candlestick.High)),
    ]);

    this.xScale.domain([firstVisibleCandleIndex, lastVisibleCandleIndex + 1]);

    this.candleStickWidth =
      this.width / (lastVisibleCandleIndex - firstVisibleCandleIndex + 1);

    this.context.clearRect(0, 0, this.width, this.height);

    candlesticks.forEach((candlestick, i) => {
      this.drawCandleStick(
        candlestick,
        i + Math.max(Math.floor(firstVisibleCandleIndex), 0)
      );
    });
  }

  private drawCandleStick(candlestick: Candlestick, i: number) {
    this.drawCandle(candlestick, i);
    this.drawStick(candlestick, i);
  }

  private drawStick(candlestick: Candlestick, i: number) {
    if (this.context == null) throw CanvasDrawer.CONTEXT_2D_MISSING_MSG;

    this.context.beginPath();

    this.context.moveTo(
      this.xScale(i) + this.candleStickWidth / 2,
      this.yScale(Math.max(candlestick.High, candlestick.Low))
    );

    this.context.lineTo(
      this.xScale(i) + this.candleStickWidth / 2,
      this.yScale(Math.min(candlestick.High, candlestick.Low))
    );

    this.context.strokeStyle = candlestickToColor(candlestick);

    this.context.stroke();
  }

  private drawCandle(candlestick: Candlestick, i: number) {
    if (this.context == null) throw CanvasDrawer.CONTEXT_2D_MISSING_MSG;

    this.context.beginPath();

    this.context.rect(
      this.xScale(i),
      this.yScale(Math.max(candlestick.Open, candlestick.Close)),
      this.candleStickWidth,
      candlestick.Open === candlestick.Close
        ? 1
        : this.yScale(Math.min(candlestick.Open, candlestick.Close)) -
            this.yScale(Math.max(candlestick.Open, candlestick.Close))
    );

    this.context.fillStyle = candlestickToColor(candlestick);
    this.context.fill();

    this.context.strokeStyle = "white";
    this.context.stroke();
  }
}

export default CanvasDrawer;
