import { createContext } from "react";

import * as PIXI from "pixi.js";

const PIXIApplicationContext = createContext<PIXI.Application | undefined>(
  undefined
);

PIXIApplicationContext.displayName = "PIXIApplicationContext";

export default PIXIApplicationContext;
