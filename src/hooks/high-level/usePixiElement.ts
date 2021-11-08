import { useEffect } from "react";

import * as PIXI from "pixi.js";

import usePixiContainer from "./usePixiContainer";

// ----------------------------------------------------------------------------

const usePixiListener = (
  element: PIXI.Container,
  event: "pointerdown" | "pointerout" | "pointerover",
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
    onPointerDown?: () => void;
    //
    onPointerOut?: () => void;
    onPointerOver?: () => void;
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
      !!listeners.onPointerDown ||
      //
      !!listeners.onPointerOut ||
      !!listeners.onPointerOver;
  }, [
    element,
    //
    listeners.onPointerDown,
    //
    listeners.onPointerOut,
    listeners.onPointerOver,
  ]);

  usePixiListener(element, "pointerdown", listeners.onPointerDown);
  //
  usePixiListener(element, "pointerout", listeners.onPointerOut);
  usePixiListener(element, "pointerover", listeners.onPointerOver);
};

export default usePixiElement;
