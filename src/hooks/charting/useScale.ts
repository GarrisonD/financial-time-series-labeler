import { useCallback, useState } from "react";

const useScale = () => {
  const [scale, setScale] = useState(1);

  const changeScaleBy = useCallback((by: number) => {
    setScale((prevScale) => prevScale * 0.999 ** by);
  }, []);

  return [scale, changeScaleBy] as const;
};

export default useScale;
