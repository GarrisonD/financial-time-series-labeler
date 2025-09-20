import { useCallback, useMemo, useState } from "react";

import type { CandlestickPopoverPosition } from "components/CandlestickPopover";

const useCandlestickPopover = () => {
  const [position, setPosition] = useState<CandlestickPopoverPosition | null>(
    null,
  );

  const onClose = useCallback(() => {
    setPosition(null);
  }, []);

  return useMemo(
    () => ({
      onClose,
      openAt: setPosition,
      position,
    }),
    [onClose, position],
  );
};

export default useCandlestickPopover;
