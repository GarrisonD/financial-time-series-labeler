import { useEffect } from "react";

import * as PIXI from "pixi.js";

import usePixiContainer from "./usePixiContainer";

type ListenerFn = PIXI.utils.EventEmitter.ListenerFn;

// ----------------------------------------------------------------------------

const usePixiListener = (
  element: PIXI.Container,
  event: "click",
  listener?: ListenerFn
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
  listeners: { onClick?: ListenerFn } = {}
) => {
  const container = usePixiContainer();

  useEffect(() => {
    container.addChild(element);

    return () => {
      container.removeChild(element);
    };
  }, [container, element]);

  useEffect(() => {
    const interactive = !!listeners.onClick;
    element.cursor = interactive ? "pointer" : "none";
    element.eventMode = interactive ? "static" : "auto";
  }, [element, listeners.onClick]);

  usePixiListener(element, "click", listeners.onClick);
};

export default usePixiElement;
