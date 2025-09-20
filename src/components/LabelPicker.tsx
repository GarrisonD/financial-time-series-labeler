import { memo } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// TODO: configurable on UI
const LABELS = ["RL", "RH"];

const LabelPicker = (props: {
  value?: string;
  onChange: (label?: string) => void;
}) => {
  return (
    <Autocomplete
      options={LABELS}
      value={props.value ?? null}
      onChange={(event, newValue) => {
        props.onChange(newValue ?? undefined);
      }}
      renderInput={(params) => <TextField {...params} label="Label" />}
      size="small"
    />
  );
};

export default memo(LabelPicker);
