import { createContext } from "react";

export const DEFAULT_CANVAS_SCALE = window.devicePixelRatio;

export default createContext(DEFAULT_CANVAS_SCALE);
