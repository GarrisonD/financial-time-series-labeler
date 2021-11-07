import { createContext } from "react";

const CandlesticksFileContext = createContext<
  | {
      file: CandlesticksFile;
      setFile: (file: CandlesticksFile) => void;
    }
  | undefined
>(undefined);

CandlesticksFileContext.displayName = "CandlesticksFileContext";

export default CandlesticksFileContext;
