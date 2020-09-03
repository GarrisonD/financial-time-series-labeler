import React from "react";

import { MessageData } from "workers/infinite-drawer";

// eslint-disable-next-line import/no-webpack-loader-syntax
import InfiniteDrawerWorker from "worker-loader!workers/infinite-drawer";

const useInfiniteDrawerWorker = () => {
  const [worker, setWorker] = React.useState<InfiniteDrawerWorker>();

  React.useEffect(() => {
    const infiniteDrawerWorker = new InfiniteDrawerWorker();

    setWorker(infiniteDrawerWorker);

    return () => infiniteDrawerWorker.terminate();
  }, []);

  return {
    init: (args: Omit<MessageData, "type">) => {
      const message: MessageData = { type: "INIT", ...args };
      worker?.postMessage(message, [args.scaledRenderingContextProvider]);
    },
  };
};

export default useInfiniteDrawerWorker;
