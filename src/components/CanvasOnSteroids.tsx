import { memo, useContext, useLayoutEffect, useRef } from "react";

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
  const canvasScale = useContext(CanvasScaleContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
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

export default memo(CanvasOnSteroids);

export type { CanvasOnSteroidsProps };
