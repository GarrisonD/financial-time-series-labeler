import InfiniteDrawer from "utils/infinite-drawer";
import ScaledCanvasDrawer from "utils/scaled-canvas-drawer";

//-----------------------------------------------------------
// Type definitions for ScaledCanvasDrawer-related messages:
//-----------------------------------------------------------

type InitScaledCanvasDrawerMessageData = {
  readonly type: "SCALED_CANVAS_DRAWER/INIT";

  readonly canvasScale: number;
  readonly offscreenCanvas: OffscreenCanvas;
  readonly candlesticks: readonly Candlestick[];
};

type UpdateScaledCanvasDrawerMessageData = {
  readonly type: "SCALED_CANVAS_DRAWER/UPDATE";

  readonly firstVisibleCandleIndex: number;
  readonly lastVisibleCandleIndex: number;
};

type ScaledCanvasDrawerMessageData =
  | InitScaledCanvasDrawerMessageData
  | UpdateScaledCanvasDrawerMessageData;

//-----------------------------------------------------------
// Type definitions for InfiniteDrawer-related messages:
//-----------------------------------------------------------

type PlayInfiniteDrawerMessageData = {
  readonly type: "INFINITE_DRAWING_LOOP/PLAY";
};

type StopInfiniteDrawerMessageData = {
  readonly type: "INFINITE_DRAWING_LOOP/STOP";
};

type InfiniteDrawerMessageData =
  | PlayInfiniteDrawerMessageData
  | StopInfiniteDrawerMessageData;

//-----------------------------------------------------------
// Global variables and web worker function:
//-----------------------------------------------------------

let infiniteDrawer: InfiniteDrawer | undefined;
let scaledCanvasDrawer: ScaledCanvasDrawer | undefined;

interface Message extends MessageEvent {
  readonly data: InfiniteDrawerMessageData | ScaledCanvasDrawerMessageData;
}

onmessage = ({ data }: Message) => {
  switch (data.type) {
    case "SCALED_CANVAS_DRAWER/INIT":
      scaledCanvasDrawer = new ScaledCanvasDrawer({
        renderingContextProvider: data.offscreenCanvas,
        candlesticks: data.candlesticks,
        scale: data.canvasScale,
      });

      infiniteDrawer = new InfiniteDrawer(scaledCanvasDrawer);
      break;
    case "SCALED_CANVAS_DRAWER/UPDATE":
      const { firstVisibleCandleIndex, lastVisibleCandleIndex } = data;
      scaledCanvasDrawer!.firstVisibleCandleIndex = firstVisibleCandleIndex;
      scaledCanvasDrawer!.lastVisibleCandleIndex = lastVisibleCandleIndex;
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
  // ScaledCanvasDrawer-related:
  InitScaledCanvasDrawerMessageData,
  UpdateScaledCanvasDrawerMessageData,
  // InfiniteDrawer-related:
  PlayInfiniteDrawerMessageData,
  StopInfiniteDrawerMessageData,
};
