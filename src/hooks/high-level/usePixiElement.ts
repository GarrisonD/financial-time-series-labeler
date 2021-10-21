import { useEffect } from "react";

import * as PIXI from "pixi.js";

import usePixiContainer from "./usePixiContainer";

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
  const container = usePixiContainer();

  useEffect(() => {
    container.addChild(element);

    return () => {
      container.removeChild(element);
    };
  }, [container, element]);

  useEffect(() => {
    element.buttonMode = element.interactive =
      !!listeners.onPointerOver || !!listeners.onPointerOut;
  }, [element, listeners.onPointerOut, listeners.onPointerOver]);

  usePixiListener(element, "pointerover", listeners.onPointerOver);
  usePixiListener(element, "pointerout", listeners.onPointerOut);
};

export default usePixiElement;
