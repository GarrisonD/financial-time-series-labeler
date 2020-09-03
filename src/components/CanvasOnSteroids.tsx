import React from "react";

type ScaledRenderingContextProvider = (HTMLCanvasElement | OffscreenCanvas) & {
  scale: number;
};

type CanvasOnSteroidsProps = {
  onScaledRenderingContextProviderReady: (
    scaledRenderingContextProvider: ScaledRenderingContextProvider
  ) => void;
  onWheel: Required<React.DOMAttributes<HTMLCanvasElement>>["onWheel"];
  scale?: number;
  // Keep these two props grouped:
  height: number;
  width: number;
};

const CanvasOnSteroids: React.FC<CanvasOnSteroidsProps> = ({
  onScaledRenderingContextProviderReady,
  scale = window.devicePixelRatio,
  // Keep these two props grouped:
  height,
  width,
  ...rest
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current!;

    const scaledRenderingContextProvider = Object.assign(
      "transferControlToOffscreen" in canvas
        ? canvas.transferControlToOffscreen()
        : canvas,
      { scale }
    );

    onScaledRenderingContextProviderReady(scaledRenderingContextProvider);
  }, [scale, onScaledRenderingContextProviderReady]);

  return (
    <canvas
      {...rest}
      ref={canvasRef}
      style={{ height, width }}
      // Keep these two props grouped:
      height={height * scale}
      width={width * scale}
    />
  );
};

export default React.memo(CanvasOnSteroids);

export type { CanvasOnSteroidsProps, ScaledRenderingContextProvider };
