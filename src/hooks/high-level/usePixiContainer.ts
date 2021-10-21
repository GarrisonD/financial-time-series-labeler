import PIXIContainerContext from "contexts/PIXIContainer";

import useContextSafe from "hooks/low-level/useContextSafe";

const usePixiContainer = () => {
  return useContextSafe(PIXIContainerContext);
};

export default usePixiContainer;
