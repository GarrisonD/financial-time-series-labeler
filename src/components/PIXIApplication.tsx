import { ReactNode, useEffect, useRef, useState } from "react";

import * as PIXI from "pixi.js";

import PIXIApplicationContext from "contexts/PIXIApplication";
import PIXIContainerContext from "contexts/PIXIContainer";

const PIXIApplication = (props: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [app, setApp] = useState<PIXI.Application | null>();

  useEffect(() => {
    if (containerRef.current) {
      // TODO: test on file re-upload
      // if (pixiAppRef.current) console.warn("PIXI")

      const height = containerRef.current.clientHeight;
      const width = containerRef.current.clientWidth;

      const app = new PIXI.Application({
        height,
        width,
        //
        resolution: window.devicePixelRatio,
        autoDensity: true,
        //
        backgroundAlpha: 0,
      });

      setApp(app);

      containerRef.current.appendChild(app.view);

      return () => {
        app?.destroy(true, {
          baseTexture: true,
          children: true,
          texture: true,
        });

        setApp(null);
      };
    }
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ border: "1px solid black", flex: 1 }} />

      {app && (
        <PIXIApplicationContext.Provider value={app}>
          <PIXIContainerContext.Provider value={app.stage}>
            {props.children}
          </PIXIContainerContext.Provider>
        </PIXIApplicationContext.Provider>
      )}
    </>
  );
};

export default PIXIApplication;
