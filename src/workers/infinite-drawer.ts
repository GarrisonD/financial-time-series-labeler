import ScaledCanvasDrawer from "utils/scaled-canvas-drawer";

type MessageData = {
  readonly type: "INIT";

  readonly scaledRenderingContextProvider: OffscreenCanvas & { scale: number };

  readonly scale: number;

  readonly height: number;
  readonly width: number;

  readonly candlesticks: readonly Candlestick[];
};

interface MessageArgs extends MessageEvent {
  readonly data: MessageData;
}

const INITIAL_VISIBLE_CANDLES_COUNT = 150;

onmessage = ({ data }: MessageArgs) => {
  switch (data.type) {
    case "INIT":
      const scaledCanvasDrawer = new ScaledCanvasDrawer(
        data.scaledRenderingContextProvider,
        data.height,
        data.width,
        data.candlesticks,
        data.scale
      );

      const scale = 1;
      const offset = 0;

      const tmp = INITIAL_VISIBLE_CANDLES_COUNT * (scale - 1);

      scaledCanvasDrawer.firstVisibleCandleIndex = offset - tmp / 2 + 0;

      scaledCanvasDrawer.lastVisibleCandleIndex =
        offset + tmp / 2 + INITIAL_VISIBLE_CANDLES_COUNT;

      scaledCanvasDrawer.draw();

      break;
  }
};

export type { MessageData };
