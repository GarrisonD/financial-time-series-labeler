import { ScaledRenderingContextProvider } from "components/CanvasOnSteroids";

import LinearScale from "./linear-scale";
import { Drawer } from "./infinite-drawer";

const candlestickToColor = (candlestick: Candlestick): string => {
  if (candlestick.open === candlestick.close) return "silver";
  return candlestick.open > candlestick.close ? "red" : "green";
};

class ScaledCanvasDrawer implements Drawer {
  // TODO: make me private
  public readonly scaledRenderingContextProvider: ScaledRenderingContextProvider;

  private context?:
    | OffscreenCanvasRenderingContext2D
    | CanvasRenderingContext2D;

  private readonly height: number;
  private readonly width: number;

  private readonly candlesticks: readonly Candlestick[];

  private readonly scale: number;

  public readonly xScale = new LinearScale();
  private readonly yScale = new LinearScale();

  private candlestickWidth = 0;

  firstVisibleCandleIndex = 0;
  lastVisibleCandleIndex = 0;

  constructor(
    scaledRenderingContextProvider: ScaledRenderingContextProvider,
    height: number,
    width: number,
    candlesticks: readonly Candlestick[],
    scale: number
  ) {
    this.scaledRenderingContextProvider = scaledRenderingContextProvider;

    this.height = height;
    this.width = width;

    this.candlesticks = candlesticks;

    this.scale = scale;

    this.xScale.range = [0, width];
    this.yScale.range = [height, 0];
  }

  draw() {
    const candlesticks = this.candlesticks.slice(
      Math.max(Math.floor(this.firstVisibleCandleIndex), 0),
      Math.min(
        Math.ceil(this.lastVisibleCandleIndex + 1),
        this.candlesticks.length
      )
    );

    this.yScale.domain = [
      Math.min(...candlesticks.map((candlestick) => candlestick.low)),
      Math.max(...candlesticks.map((candlestick) => candlestick.high)),
    ];

    this.xScale.domain = [
      this.firstVisibleCandleIndex,
      this.lastVisibleCandleIndex + 1,
    ];

    this.candlestickWidth =
      this.width /
      (this.lastVisibleCandleIndex - this.firstVisibleCandleIndex + 1);

    this.getContext().clearRect(0, 0, this.width, this.height);

    candlesticks.forEach((candlestick) => {
      this.drawCandleStick(candlestick);
    });
  }

  private drawCandleStick(candlestick: Candlestick) {
    this.drawCandle(candlestick);
    this.drawStick(candlestick);
  }

  private drawStick(candlestick: Candlestick) {
    this.getContext().beginPath();

    this.getContext().moveTo(
      this.xScale.domainToRange(candlestick.index) + this.candlestickWidth / 2,
      this.yScale.domainToRange(Math.max(candlestick.high, candlestick.low))
    );

    this.getContext().lineTo(
      this.xScale.domainToRange(candlestick.index) + this.candlestickWidth / 2,
      this.yScale.domainToRange(Math.min(candlestick.high, candlestick.low))
    );

    this.getContext().strokeStyle = candlestickToColor(candlestick);
    this.getContext().stroke();
  }

  private drawCandle(candlestick: Candlestick) {
    this.getContext().beginPath();

    this.getContext().rect(
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

    this.getContext().fillStyle = candlestickToColor(candlestick);
    this.getContext().fill();

    this.getContext().strokeStyle = "white";
    this.getContext().stroke();
  }

  private getContext() {
    if (this.context == null) {
      const context = this.scaledRenderingContextProvider.getContext("2d", {
        alpha: true,
        desynchronized: true,
      });

      if (context == null) {
        // TODO: specify the error message!!!
        throw new Error("Some error here!");
      }

      context.scale(this.scale, this.scale);

      this.context = context;
    }

    return this.context;
  }
}

export default ScaledCanvasDrawer;
