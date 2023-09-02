import { createContext } from "react";

import * as PIXI from "pixi.js";

const PIXIContainerContext = createContext<PIXI.Container | undefined>(
  undefined,
);

PIXIContainerContext.displayName = "PIXIContainerContext";

export default PIXIContainerContext;
