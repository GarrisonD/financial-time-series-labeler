import { memo, ReactNode, useEffect, useMemo } from "react";

import * as PIXI from "pixi.js";

import PIXIContainerContext from "contexts/PIXIContainer";

import usePixiElement from "hooks/high-level/usePixiElement";

const PIXIContainer = (props: { children: ReactNode; x: number }) => {
  const container = useMemo(() => new PIXI.Container(), []);

  usePixiElement(container);

  useEffect(() => {
    container.x = props.x;
  }, [container, props.x]);

  return (
    <PIXIContainerContext.Provider value={container}>
      {props.children}
    </PIXIContainerContext.Provider>
  );
};

export default memo(PIXIContainer);
