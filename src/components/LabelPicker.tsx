import { memo } from "react";

import { Menu, MenuItem, MenuItemLabel } from "./ui/Menu";

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
    <Menu isOpen={true} onClose={props.onClose} position={props.position}>
      <MenuItem
        onPress={() => {
          props.onChange();
          props.onClose();
        }}
        selected={!props.value}
      >
        <MenuItemLabel>NA</MenuItemLabel>
      </MenuItem>

      {LABELS.map((label) => (
        <MenuItem
          key={label}
          onPress={() => {
            props.onChange(label);
            props.onClose();
          }}
          selected={props.value === label}
        >
          <MenuItemLabel>{label}</MenuItemLabel>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default memo(LabelPicker);

export type { LabelPickerPosition };
