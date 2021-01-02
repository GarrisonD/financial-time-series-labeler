import CanvasDrawer from "drawers/low-level/canvas-drawer";

import LinearScale from "utils/linear-scale";

import type { Drawerable } from "./infinite-drawer";

const candlestickToColor = (candlestick: Candlestick): string => {
  if (candlestick.open === candlestick.close) return "silver";
  return candlestick.open > candlestick.close ? "red" : "green";
};

class CandlesticksDrawer implements Drawerable {
  public readonly xScale = new LinearScale();
  private readonly yScale = new LinearScale();

  #candlestickWidth = 0;

  firstVisibleCandleIndex = 0;
  lastVisibleCandleIndex = 0;

  constructor(
    private readonly canvasDrawer: CanvasDrawer,
    private readonly candlesticks: readonly Candlestick[]
  ) {
    this.xScale.range = [0, canvasDrawer.width];
    this.yScale.range = [canvasDrawer.height, 0];
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

    this.#candlestickWidth =
      this.canvasDrawer.width /
      (this.lastVisibleCandleIndex - this.firstVisibleCandleIndex + 1);

    this.canvasDrawer.clear();

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
      this.xScale.domainToRange(candlestick.index) + this.#candlestickWidth / 2,
      this.yScale.domainToRange(Math.max(candlestick.high, candlestick.low))
    );

    this.getContext().lineTo(
      this.xScale.domainToRange(candlestick.index) + this.#candlestickWidth / 2,
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
      this.#candlestickWidth,
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
    return this.canvasDrawer.context;
  }
}

export default CandlesticksDrawer;