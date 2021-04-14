import { useEffect } from "react";

import * as PIXI from "pixi.js";

import usePixiApplication from "./usePixiApplication";

// ----------------------------------------------------------------------------

const usePixiListener = (
  element: PIXI.Container,
  event: "pointerover" | "pointerout",
  listener?: () => void
) => {
  useEffect(() => {
    if (listener) {
      element.on(event, listener);

      return () => {
        element.off(event, listener);
      };
    }
  }, [element, event, listener]);
};

// ----------------------------------------------------------------------------

const usePixiElement = (
  element: PIXI.Container,
  listeners: {
    onPointerOver?: () => void;
    onPointerOut?: () => void;
  } = {}
) => {
  const app = usePixiApplication();

  useEffect(() => {
    app.stage.addChild(element);

    return () => {
      console.warn("PIXI.Application changed!"); // TODO: test on chart scrolling
    };
  }, [app, element]);

  useEffect(() => {
    element.buttonMode = element.interactive =
      !!listeners.onPointerOver || !!listeners.onPointerOut;
  }, [listeners.onPointerOver, listeners.onPointerOut, element]);

  usePixiListener(element, "pointerover", listeners.onPointerOver);
  usePixiListener(element, "pointerout", listeners.onPointerOut);
};

export default usePixiElement;
