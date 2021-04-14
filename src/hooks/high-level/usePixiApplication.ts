import PIXIApplicationContext from "contexts/PIXIApplication";

import useContextSafe from "hooks/low-level/useContextSafe";

const usePixiApplication = () => {
  return useContextSafe(PIXIApplicationContext);
};

export default usePixiApplication;
