import { useCallback, useMemo, useState } from "react";

import type { LabelPickerPosition } from "components/LabelPicker";

const useLabelPickerProps = () => {
  const [position, setPosition] = useState<LabelPickerPosition | null>(null);

  const onClose = useCallback(() => {
    setPosition(null);
  }, []);

  return useMemo(
    () => ({
      onClose,
      openAt: setPosition,
      position,
    }),
    [onClose, position]
  );
};

export default useLabelPickerProps;
