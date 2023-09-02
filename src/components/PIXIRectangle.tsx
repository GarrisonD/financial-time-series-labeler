import { memo, useEffect, useMemo } from "react";

import * as PIXI from "pixi.js";

import usePixiElement from "hooks/high-level/usePixiElement";

const PIXIRectangle = (
  props: {
    x1: number;
    y1: number;

    x2: number;
    y2: number;

    color: number;
  } & Parameters<typeof usePixiElement>[1],
) => {
  const graphics = useMemo(() => new PIXI.Graphics(), []);

  const x = useMemo(() => Math.min(props.x1, props.x2), [props.x1, props.x2]);
  const y = useMemo(() => Math.min(props.y1, props.y2), [props.y1, props.y2]);

  usePixiElement(graphics, { onClick: props.onClick });

  useEffect(() => {
    graphics.clear();

    graphics.beginFill(props.color);

    const width = Math.abs(props.x2 - props.x1);
    const height = Math.abs(props.y2 - props.y1);
    graphics.drawRect(0, 0, width, height);

    graphics.endFill();
  }, [graphics, props.color, props.x1, props.x2, props.y1, props.y2]);

  useEffect(() => {
    graphics.x = x;
    graphics.y = y;
  }, [graphics, x, y]);

  return null;
};

export default memo(PIXIRectangle);
