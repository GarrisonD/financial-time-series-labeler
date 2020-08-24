import React from "react";

const useOffset = () => {
  const [offset, setOffset] = React.useState(0);

  const changeOffsetBy = React.useCallback((by: number) => {
    setOffset((prevOffset) => prevOffset - 0.2 * by);
  }, []);

  return [offset, changeOffsetBy] as const;
};

export default useOffset;
