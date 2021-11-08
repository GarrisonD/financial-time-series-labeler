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

  const [pointerOver, setPointerOver] = useState(false);

  const handlePointerOver = useCallback(() => {
    setPointerOver(true);
  }, []);

  const handlePointerOut = useCallback(() => {
    setPointerOver(false);
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
        color={
          pointerOver ? 0xe0e0e0 : candlestick.labeled ? 0xeeeeee : 0xffffff
        }
        //
        onPointerOut={handlePointerOut}
        onPointerOver={handlePointerOver}
        //
        onClick={candlestick.toggleLabeled}
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
          candlestick.bullish ? candlestick.open : candlestick.close
        )}
        //
        x2={candlestickPlaceholderWidth * 0.8}
        y2={yScale.domainToRange(
          candlestick.bullish ? candlestick.close : candlestick.open
        )}
        // https://material.io/design/color/the-color-system.html#tools-for-picking-colors:
        color={candlestick.bullish ? 0x16bf6a : 0xbf166a}
      />
    </PIXIContainer>
  );
};

export default memo(Candlestick);
