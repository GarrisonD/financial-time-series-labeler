import { useLayoutEffect, useRef, useState } from "react";

const REFERENCE_IS_EMPTY = "Reference is empty but expected to be present!";

const useDimensions = <
  T extends {
    clientHeight: number;
    clientWidth: number;
  }
>() => {
  const ref = useRef<T>(null);

  const [dimensions, setDimensions] = useState<{
    height: number;
    width: number;
  }>();

  useLayoutEffect(() => {
    if (ref.current == null) {
      throw new Error(REFERENCE_IS_EMPTY);
    }

    setDimensions({
      height: ref.current.clientHeight,
      width: ref.current.clientWidth,
    });
  }, []);

  return [ref, dimensions] as const;
};

export default useDimensions;
