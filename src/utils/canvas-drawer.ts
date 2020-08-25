import LinearScale from "./linear-scale";

const candlestickToColor = (candlestick: Candlestick): string => {
  if (candlestick.open === candlestick.close) return "silver";
  return candlestick.open > candlestick.close ? "red" : "green";
};

class CanvasDrawer {
  static readonly CONTEXT_2D_MISSING_MSG =
    "2D Context is missing... I suppose you forget to call #prepare...";

  private context: CanvasRenderingContext2D;

  private width: number;
  private height: number;

  private candlesticks: readonly Candlestick[];

  public xScale: LinearScale;
  private yScale: LinearScale;

  private candlestickWidth = 0;

  constructor(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    candlesticks: Candlestick[]
  ) {
    this.context = context;

    this.width = width;
    this.height = height;

    this.candlesticks = candlesticks;

    this.xScale = new LinearScale();
    this.xScale.range = [0, width];

    this.yScale = new LinearScale();
    this.yScale.range = [height, 0];
  }

  draw(firstVisibleCandleIndex: number, lastVisibleCandleIndex: number) {
    if (this.context == null) throw CanvasDrawer.CONTEXT_2D_MISSING_MSG;

    const candlesticks = this.candlesticks.slice(
      Math.max(Math.floor(firstVisibleCandleIndex), 0),
      Math.min(Math.ceil(lastVisibleCandleIndex + 1), this.candlesticks.length)
    );

    this.yScale.domain = [
      Math.min(...candlesticks.map((candlestick) => candlestick.low)),
      Math.max(...candlesticks.map((candlestick) => candlestick.high)),
    ];

    this.xScale.domain = [firstVisibleCandleIndex, lastVisibleCandleIndex + 1];

    this.candlestickWidth =
      this.width / (lastVisibleCandleIndex - firstVisibleCandleIndex + 1);

    this.context.clearRect(0, 0, this.width, this.height);

    candlesticks.forEach((candlestick) => {
      this.drawCandleStick(candlestick);
    });
  }

  private drawCandleStick(candlestick: Candlestick) {
    this.drawCandle(candlestick);
    this.drawStick(candlestick);
  }

  private drawStick(candlestick: Candlestick) {
    if (this.context == null) throw CanvasDrawer.CONTEXT_2D_MISSING_MSG;

    this.context.beginPath();

    this.context.moveTo(
      this.xScale.domainToRange(candlestick.index) + this.candlestickWidth / 2,
      this.yScale.domainToRange(Math.max(candlestick.high, candlestick.low))
    );

    this.context.lineTo(
      this.xScale.domainToRange(candlestick.index) + this.candlestickWidth / 2,
      this.yScale.domainToRange(Math.min(candlestick.high, candlestick.low))
    );

    this.context.strokeStyle = candlestickToColor(candlestick);

    this.context.stroke();
  }

  private drawCandle(candlestick: Candlestick) {
    if (this.context == null) throw CanvasDrawer.CONTEXT_2D_MISSING_MSG;

    this.context.beginPath();

    this.context.rect(
      this.xScale.domainToRange(candlestick.index),
      this.yScale.domainToRange(Math.max(candlestick.open, candlestick.close)),
      this.candlestickWidth,
      candlestick.open === candlestick.close
        ? 1
        : this.yScale.domainToRange(
            Math.min(candlestick.open, candlestick.close)
          ) -
            this.yScale.domainToRange(
              Math.max(candlestick.open, candlestick.close)
            )
    );

    this.context.fillStyle = candlestickToColor(candlestick);
    this.context.fill();

    this.context.strokeStyle = "white";
    this.context.stroke();
  }
}

export default CanvasDrawer;
