import React from "react";

import CanvasScaleContext from "contexts/CanvasScale";

import CanvasDrawer from "drawers/low-level/canvas-drawer";

type CanvasOnSteroidsProps = {
  onCanvasDrawerReady: (canvasDrawer: CanvasDrawer) => void;
  onWheel: Required<React.DOMAttributes<HTMLCanvasElement>>["onWheel"];
  // Keep these two props grouped:
  height: number;
  width: number;
};

const CanvasOnSteroids: React.FC<CanvasOnSteroidsProps> = ({
  onCanvasDrawerReady,
  // Keep these two props grouped:
  height,
  width,
  ...rest
}) => {
  const canvasScale = React.useContext(CanvasScaleContext);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useLayoutEffect(() => {
    // prettier-ignore
    onCanvasDrawerReady(
      new CanvasDrawer(
        canvasRef.current!,
        { scale: canvasScale }
      )
    );
  }, [onCanvasDrawerReady, canvasScale]);

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

export type { CanvasOnSteroidsProps };
