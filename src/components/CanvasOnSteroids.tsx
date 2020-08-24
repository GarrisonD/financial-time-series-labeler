import React from "react";

const GET_CONTEXT_2D_FAILED_MSG =
  "Getting of 2D Context failed... May your browser not support it?..";

type CanvasOnSteroidsProps = {
  onContextReady: (context: CanvasRenderingContext2D) => void;
  onWheel: Required<React.DOMAttributes<HTMLCanvasElement>>["onWheel"];
  scale?: number;
  // Keep these two props grouped:
  height: number;
  width: number;
};

const CanvasOnSteroids: React.FC<CanvasOnSteroidsProps> = ({
  onContextReady,
  scale = window.devicePixelRatio,
  onWheel,
  // Keep these two props grouped:
  height,
  width,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current!;

    // Turn off the transparency feature. According to MSN it
    // allows some browsers to optimize and speed up the rendering
    const context = canvas.getContext("2d", { alpha: false });

    if (context == null) {
      throw new Error(GET_CONTEXT_2D_FAILED_MSG);
    }

    // Fix issue with blurry canvas on Retina
    context.scale(scale, scale);

    onContextReady(context);
  }, [scale, onContextReady]);

  return (
    <canvas
      onWheel={onWheel}
      ref={canvasRef}
      style={{ height, width }}
      // Keep these two props grouped:
      height={height * scale}
      width={width * scale}
    />
  );
};

export default React.memo(CanvasOnSteroids);

export type { CanvasOnSteroidsProps };
