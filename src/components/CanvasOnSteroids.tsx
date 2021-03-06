import { memo, useLayoutEffect, useRef } from "react";

import CanvasDrawer from "drawers/low-level/canvas-drawer";

type CanvasOnSteroidsProps = Pick<
  React.DOMAttributes<HTMLCanvasElement>,
  "onMouseMove" | "onWheel"
> & {
  onCanvasDrawerReady: (canvasDrawer: CanvasDrawer) => void;
  //
  //
  height: number;
  width: number;
  //
  scale: number;
};

const CanvasOnSteroids: React.FC<CanvasOnSteroidsProps> = ({
  onCanvasDrawerReady,
  //
  height,
  width,
  //
  scale,
  //
  ...rest
}) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current!;

    onCanvasDrawerReady(
      new CanvasDrawer(
        "transferControlToOffscreen" in canvas
          ? canvas.transferControlToOffscreen()
          : canvas,
        { scale }
      )
    );
  }, [onCanvasDrawerReady, scale]);

  return (
    <canvas
      {...rest}
      //
      ref={ref}
      //
      style={{ height, width }}
      //
      height={height * scale}
      width={width * scale}
    />
  );
};

export default memo(CanvasOnSteroids);

export type { CanvasOnSteroidsProps };
