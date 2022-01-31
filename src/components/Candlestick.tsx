import { memo, useCallback } from "react";

import LabelPicker from "./LabelPicker";

import PIXIContainer from "./PIXIContainer";
import PIXILine from "./PIXILine";
import PIXIRectangle from "./PIXIRectangle";

import useCandlestick from "hooks/high-level/useCandlestick";
import useCandlesticksScales from "hooks/high-level/useCandlesticksScales";
import useCandlesticksSettings from "hooks/high-level/useCandlesticksSettings";

import useLabelPickerProps from "hooks/high-level/useLabelPickerProps";
import usePixiDimensions from "hooks/high-level/usePixiDimensions";

const Candlestick = (props: { index: number }) => {
  const candlestick = useCandlestick(props.index);

  const { height } = usePixiDimensions();
  const { xScale, yScale } = useCandlesticksScales();
  const { candlestickPlaceholderWidth } = useCandlesticksSettings();

  const labelPickerProps = useLabelPickerProps();

  const handleCandleClick = useCallback(
    (e) => {
      const pointerEvent = e.data.originalEvent as PointerEvent;

      labelPickerProps.openAt({
        top: pointerEvent.y,
        left: pointerEvent.x,
      });
    },
    [labelPickerProps]
  );

  const xOffset = xScale.domainToRange(props.index);

  return (
    <>
      <PIXIContainer x={xOffset}>
        <PIXIRectangle
          x1={0}
          y1={0}
          //
          x2={candlestickPlaceholderWidth}
          y2={height}
          //
          color={candlestick.label ? 0xeeeeee : 0xffffff}
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
          //
          onClick={handleCandleClick}
        />
      </PIXIContainer>

      {labelPickerProps.position && (
        <LabelPicker
          value={candlestick.label}
          onChange={candlestick.setLabel}
          //
          onClose={labelPickerProps.onClose}
          position={labelPickerProps.position}
        />
      )}
    </>
  );
};

export default memo(Candlestick);
