import React from "react";

const REFERENCE_IS_EMPTY = "Reference is empty but expected to be present!";

const useDimensions = <
  T extends {
    clientHeight: number;
    clientWidth: number;
  }
>() => {
  const ref = React.useRef<T>(null);

  const [dimensions, setDimensions] = React.useState<{
    height: number;
    width: number;
  }>();

  React.useLayoutEffect(() => {
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
