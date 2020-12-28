import React from "react";

import CanvasScaleContext from "contexts/CanvasScale";

type RenderingContextProvider = HTMLCanvasElement;

type CanvasOnSteroidsProps = {
  onRenderingContextProviderReady: (rcp: RenderingContextProvider) => void;
  onWheel: Required<React.DOMAttributes<HTMLCanvasElement>>["onWheel"];
  // Keep these two props grouped:
  height: number;
  width: number;
};

const CanvasOnSteroids: React.FC<CanvasOnSteroidsProps> = ({
  onRenderingContextProviderReady,
  // Keep these two props grouped:
  height,
  width,
  ...rest
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasScale = React.useContext(CanvasScaleContext);

  React.useLayoutEffect(() => {
    onRenderingContextProviderReady(canvasRef.current!);
  }, [onRenderingContextProviderReady]);

  return (
    <canvas
      {...rest}
      ref={canvasRef}
      style={{ height, width }}
      // Keep these two props grouped:
      height={height * canvasScale}
      width={width * canvasScale}
    />
  );
};

export default React.memo(CanvasOnSteroids);

export type { CanvasOnSteroidsProps, RenderingContextProvider };
