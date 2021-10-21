import { useMemo } from "react";

import usePixiApplication from "./usePixiApplication";

const usePixiDimensions = () => {
  const app = usePixiApplication();
  const { height, width } = app.renderer.screen;
  return useMemo(() => ({ height, width }), [height, width]);
};

export default usePixiDimensions;
