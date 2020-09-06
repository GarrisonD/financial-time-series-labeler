import React from "react";

import {
  // ScaledCanvasDrawer-related:
  InitScaledCanvasDrawerMessageData,
  UpdateScaledCanvasDrawerMessageData,
  // InfiniteDrawer-related:
  PlayInfiniteDrawerMessageData,
  StopInfiniteDrawerMessageData,
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

  const [isInfiniteDrawerPlaying, setInfiniteDrawerPlaying] = React.useState(
    false
  );

  React.useEffect(() => {
    const infiniteDrawerWorker = new InfiniteDrawerWorker();
    setWorker(infiniteDrawerWorker); // to terminate later
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

  const playInfiniteDrawer = React.useCallback(() => {
    const message: PlayInfiniteDrawerMessageData = {
      type: "INFINITE_DRAWING_LOOP/PLAY",
    };

    worker!.postMessage(message);

    setInfiniteDrawerPlaying(true);
  }, [worker]);

  const stopInfiniteDrawer = React.useCallback(() => {
    const message: StopInfiniteDrawerMessageData = {
      type: "INFINITE_DRAWING_LOOP/STOP",
    };

    worker!.postMessage(message);

    setInfiniteDrawerPlaying(false);
  }, [worker]);

  return [
    isWorkerReady,
    isScaledCanvasDrawerReady,
    isInfiniteDrawerPlaying,
    {
      // ScaledCanvasDrawer-related:
      initScaledCanvasDrawer,
      updateScaledCanvasDrawer,
      // InfiniteDrawer-related:
      playInfiniteDrawer,
      stopInfiniteDrawer,
    },
  ] as const;
};

export default useInfiniteDrawerWorker;
