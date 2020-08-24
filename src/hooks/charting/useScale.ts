import React from "react";

const useScale = () => {
  const [scale, setScale] = React.useState(1);

  const changeScaleBy = React.useCallback((by: number) => {
    setScale((prevScale) => prevScale * 0.999 ** by);
  }, []);

  return [scale, changeScaleBy] as const;
};

export default useScale;
