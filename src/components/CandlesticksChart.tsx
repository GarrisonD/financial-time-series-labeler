import { memo } from "react";

import Candlesticks from "./Candlesticks";
import CandlesticksScales from "./CandlesticksScales";
import CandlesticksViewPoint from "./CandlesticksViewPoint";

import PIXIApplication from "./PIXIApplication";

const CandlesticksChart = () => {
  return (
    <PIXIApplication>
      <CandlesticksViewPoint>
        <CandlesticksScales>
          <Candlesticks />
        </CandlesticksScales>
      </CandlesticksViewPoint>
    </PIXIApplication>
  );
};

export default memo(CandlesticksChart);
