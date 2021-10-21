import { memo, useEffect, useMemo } from "react";

import * as PIXI from "pixi.js";

import usePixiElement from "hooks/high-level/usePixiElement";

const PIXILine = (props: {
  x1: number;
  y1: number;

  x2: number;
  y2: number;

  width: number;
  color: number;
}) => {
  const graphics = useMemo(() => new PIXI.Graphics(), []);

  const x = useMemo(() => Math.min(props.x1, props.x2), [props.x1, props.x2]);
  const y = useMemo(() => Math.min(props.y1, props.y2), [props.y1, props.y2]);

  usePixiElement(graphics);

  useEffect(() => {
    graphics.clear();

    // prettier-ignore
    graphics
      .lineStyle(props.width, props.color)
      .lineTo(
        Math.abs(props.x2 - props.x1),
        Math.abs(props.y2 - props.y1)
      );
  }, [
    graphics,
    props.color,
    props.width,
    props.x1,
    props.x2,
    props.y1,
    props.y2,
  ]);

  useEffect(() => {
    graphics.x = x;
    graphics.y = y;
  }, [graphics, x, y]);

  return null;
};

export default memo(PIXILine);
