import React from "react";

import {
  InitScaledCanvasDrawerMessageData,
  UpdateScaledCanvasDrawerMessageData,
  PlayInfiniteDrawingLoopMessageData,
  StopInfiniteDrawingLoopMessageData,
} from "workers/infinite-drawer";

// eslint-disable-next-line import/no-webpack-loader-syntax
import InfiniteDrawerWorker from "worker-loader!workers/infinite-drawer";

const useInfiniteDrawerWorker = () => {
  const [worker, setWorker] = React.useState<InfiniteDrawerWorker>();

  const isWorkerReady = !!worker;

  const [
    isScaledCanvasDrawerReady,
    setScaledCanvasDrawerReady,
  ] = React.useState(false);

  const [
    isInfiniteDrawingLoopPlaying,
    setInfiniteDrawingLoopPlaying,
  ] = React.useState(false);

  React.useEffect(() => {
    const infiniteDrawerWorker = new InfiniteDrawerWorker();

    // cache to have an ability to terminate it later
    setWorker(infiniteDrawerWorker);

    return () => infiniteDrawerWorker.terminate();
  }, []);

  const initScaledCanvasDrawer = React.useCallback(
    (args: Omit<InitScaledCanvasDrawerMessageData, "type">) => {
      const message: InitScaledCanvasDrawerMessageData = {
        type: "SCALED_CANVAS_DRAWER/INIT",
        ...args,
      };

      worker!.postMessage(message, [args.offscreenCanvas]);

      setScaledCanvasDrawerReady(true);
    },
    [worker]
  );

  const updateScaledCanvasDrawer = React.useCallback(
    (args: Omit<UpdateScaledCanvasDrawerMessageData, "type">) => {
      const message: UpdateScaledCanvasDrawerMessageData = {
        type: "SCALED_CANVAS_DRAWER/UPDATE",
        ...args,
      };

      worker!.postMessage(message);
    },
    [worker]
  );

  const playInfiniteDrawingLoop = React.useCallback(() => {
    const message: PlayInfiniteDrawingLoopMessageData = {
      type: "INFINITE_DRAWING_LOOP/PLAY",
    };

    worker!.postMessage(message);

    setInfiniteDrawingLoopPlaying(true);
  }, [worker]);

  const stopInfiniteDrawingLoop = React.useCallback(() => {
    const message: StopInfiniteDrawingLoopMessageData = {
      type: "INFINITE_DRAWING_LOOP/STOP",
    };

    worker!.postMessage(message);

    setInfiniteDrawingLoopPlaying(false);
  }, [worker]);

  return [
    isWorkerReady,
    isScaledCanvasDrawerReady,
    isInfiniteDrawingLoopPlaying,
    {
      initScaledCanvasDrawer,
      updateScaledCanvasDrawer,
      playInfiniteDrawingLoop,
      stopInfiniteDrawingLoop,
    },
  ] as const;
};

export default useInfiniteDrawerWorker;
