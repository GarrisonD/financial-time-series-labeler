import InfiniteDrawer from "utils/infinite-drawer";
import ScaledCanvasDrawer from "utils/scaled-canvas-drawer";

type InitScaledCanvasDrawerMessageData = {
  readonly type: "SCALED_CANVAS_DRAWER/INIT";

  readonly canvasScale: number;
  readonly offscreenCanvas: OffscreenCanvas;

  readonly height: number;
  readonly width: number;

  readonly candlesticks: readonly Candlestick[];
};

type UpdateScaledCanvasDrawerMessageData = {
  readonly type: "SCALED_CANVAS_DRAWER/UPDATE";

  readonly firstVisibleCandleIndex: number;
  readonly lastVisibleCandleIndex: number;
};

type PlayInfiniteDrawingLoopMessageData = {
  type: "INFINITE_DRAWING_LOOP/PLAY";
};

type StopInfiniteDrawingLoopMessageData = {
  type: "INFINITE_DRAWING_LOOP/STOP";
};

interface MessageArgs extends MessageEvent {
  readonly data:
    | InitScaledCanvasDrawerMessageData
    | UpdateScaledCanvasDrawerMessageData
    | PlayInfiniteDrawingLoopMessageData
    | StopInfiniteDrawingLoopMessageData;
}

let scaledCanvasDrawer: ScaledCanvasDrawer | undefined;
let infiniteDrawer: InfiniteDrawer | undefined;

onmessage = ({ data }: MessageArgs) => {
  switch (data.type) {
    case "SCALED_CANVAS_DRAWER/INIT":
      scaledCanvasDrawer = new ScaledCanvasDrawer({
        renderingContextProvider: data.offscreenCanvas,
        height: data.height,
        width: data.width,
        candlesticks: data.candlesticks,
        scale: data.canvasScale,
      });

      infiniteDrawer = new InfiniteDrawer(scaledCanvasDrawer);
      break;
    case "SCALED_CANVAS_DRAWER/UPDATE":
      scaledCanvasDrawer!.firstVisibleCandleIndex =
        data.firstVisibleCandleIndex;
      scaledCanvasDrawer!.lastVisibleCandleIndex = data.lastVisibleCandleIndex;
      break;
    case "INFINITE_DRAWING_LOOP/PLAY":
      infiniteDrawer!.play(); // throw an error!
      break;
    case "INFINITE_DRAWING_LOOP/STOP":
      infiniteDrawer!.stop(); // throw an error!
      break;
  }
};

export type {
  InitScaledCanvasDrawerMessageData,
  UpdateScaledCanvasDrawerMessageData,
  PlayInfiniteDrawingLoopMessageData,
  StopInfiniteDrawingLoopMessageData,
};
