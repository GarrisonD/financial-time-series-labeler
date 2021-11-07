import { memo, useCallback, useState } from "react";

import PIXIContainer from "./PIXIContainer";
import PIXILine from "./PIXILine";
import PIXIRectangle from "./PIXIRectangle";

import usePixiDimensions from "hooks/high-level/usePixiDimensions";

import useCandlestick from "hooks/high-level/useCandlestick";
import useCandlesticksScales from "hooks/high-level/useCandlesticksScales";
import useCandlesticksSettings from "hooks/high-level/useCandlesticksSettings";

const Candlestick = (props: { index: number }) => {
  const candlestick = useCandlestick(props.index);

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
    <PIXIContainer x={xOffset}>
      <PIXIRectangle
        x1={0}
        y1={0}
        //
        x2={candlestickPlaceholderWidth}
        y2={height}
        //
        color={color}
        //
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      <PIXILine
        x1={candlestickPlaceholderWidth * 0.5}
        y1={yScale.domainToRange(candlestick.low)}
        //
        x2={candlestickPlaceholderWidth * 0.5}
        y2={yScale.domainToRange(candlestick.high)}
        //
        color={0x000}
        width={1}
      />

      <PIXIRectangle
        x1={candlestickPlaceholderWidth * 0.2}
        y1={yScale.domainToRange(
          candlestick.isBullish ? candlestick.open : candlestick.close
        )}
        //
        x2={candlestickPlaceholderWidth * 0.8}
        y2={yScale.domainToRange(
          candlestick.isBullish ? candlestick.close : candlestick.open
        )}
        //
        color={candlestick.isBullish ? 0x2a9d8f : 0xe76f51}
      />
    </PIXIContainer>
  );
};

export default memo(Candlestick);
