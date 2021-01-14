import { useCallback, useState } from "react";

const useOffset = () => {
  const [offset, setOffset] = useState(0);

  const changeOffsetBy = useCallback((by: number) => {
    setOffset((prevOffset) => prevOffset - 0.5 * by);
  }, []);

  return [offset, changeOffsetBy] as const;
};

export default useOffset;
