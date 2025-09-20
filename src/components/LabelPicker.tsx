import { memo } from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// TODO: configurable on UI
const LABELS = ["RL", "RH"];

const LabelPicker = (props: {
  value?: string;
  onChange: (label?: string) => void;
}) => {
  return (
    <Select
      value={props.value || ""}
      onChange={(event) => {
        const value = event.target.value;
        props.onChange(value === "" ? undefined : value);
      }}
      displayEmpty
    >
      <MenuItem value="">NA</MenuItem>
      {LABELS.map((label) => (
        <MenuItem key={label} value={label}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default memo(LabelPicker);
