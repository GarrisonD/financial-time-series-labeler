import { memo } from "react";

import Popover from "@mui/material/Popover";

import useCandlestick from "hooks/high-level/useCandlestick";

import LabelPicker from "./LabelPicker";

type CandlestickPopoverPosition = { top: number; left: number };

const CandlestickPopover = (props: {
  candlestickIndex: number;
  //
  onClose: () => void;
  position: CandlestickPopoverPosition | null;
}) => {
  const candlestick = useCandlestick(props.candlestickIndex);

  return (
    <Popover
      open={!!props.position}
      onClose={props.onClose}
      //
      anchorReference="anchorPosition"
      anchorPosition={props.position ?? undefined}
    >
      <LabelPicker value={candlestick.label} onChange={candlestick.setLabel} />
    </Popover>
  );
};

export default memo(CandlestickPopover);

export type { CandlestickPopoverPosition };
