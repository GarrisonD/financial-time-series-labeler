import { createContext } from "react";

const CandlesticksFileContext = createContext<
  | {
      file: CandlesticksFile;
      setFile: React.Dispatch<
        React.SetStateAction<CandlesticksFile | undefined>
      >;
    }
  | undefined
>(undefined);

CandlesticksFileContext.displayName = "CandlesticksFileContext";

export default CandlesticksFileContext;
