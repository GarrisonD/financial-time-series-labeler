import { memo } from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// TODO: configurable on UI
const LABELS = ["RL", "RH"];

type LabelPickerPosition = { top: number; left: number };

const LabelPicker = (props: {
  value?: string;
  onChange: (label?: string) => void;
  //
  onClose: () => void;
  position: LabelPickerPosition;
}) => {
  return (
    <Menu
      open
      onClose={props.onClose}
      anchorReference="anchorPosition"
      anchorPosition={props.position}
    >
      <MenuItem
        onClick={() => {
          props.onChange();
          props.onClose();
        }}
        selected={!props.value}
      >
        NA
      </MenuItem>

      {LABELS.map((label) => (
        <MenuItem
          key={label}
          onClick={() => {
            props.onChange(label);
            props.onClose();
          }}
          selected={props.value === label}
        >
          {label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default memo(LabelPicker);

export type { LabelPickerPosition };
