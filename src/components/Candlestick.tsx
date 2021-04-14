import { useCallback, useState } from "react";

import PIXILine from "./PIXILine";
import PIXIRectangle from "./PIXIRectangle";

import usePixiDimensions from "hooks/high-level/usePixiDimensions";

import useCandlesticksScales from "hooks/high-level/useCandlesticksScales";
import useCandlesticksSettings from "hooks/high-level/useCandlesticksSettings";

const Candlestick = (props: Candlestick) => {
  const isBullish = props.close > props.open;

  const { height } = usePixiDimensions();
  const { xScale, yScale } = useCandlesticksScales();
  const { candlestickPlaceholderWidth } = useCandlesticksSettings();

  const [color, setColor] = useState(0xffffff);

  const handlePointerOver = useCallback(() => {
    setColor(0xffd6a5);
  }, []);

  const handlePointerOut = useCallback(() => {
    setColor(0xffffff);
  }, []);

  const xOffset = xScale.domainToRange(props.index);

  return (
    <>
      <PIXIRectangle
        x1={xOffset}
        y1={0}
        //
        x2={xOffset + candlestickPlaceholderWidth}
        y2={height}
        //
        color={color}
        //
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      <PIXILine
        x1={xOffset + candlestickPlaceholderWidth * 0.5}
        y1={yScale.domainToRange(props.low)}
        //
        x2={xOffset + candlestickPlaceholderWidth * 0.5}
        y2={yScale.domainToRange(props.high)}
        //
        color={0x000}
        width={1}
      />

      <PIXIRectangle
        x1={xOffset + candlestickPlaceholderWidth * 0.2}
        y1={yScale.domainToRange(isBullish ? props.open : props.close)}
        //
        x2={xOffset + candlestickPlaceholderWidth * 0.8}
        y2={yScale.domainToRange(isBullish ? props.close : props.open)}
        //
        color={isBullish ? 0x2a9d8f : 0xe76f51}
      />
    </>
  );
};

export default Candlestick;
