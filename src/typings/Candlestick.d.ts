type Candlestick = {
  index: number;
  label?: string;

  timestamp: number;

  // DO NOT SORT THE PROPERTIES BELOW!
  // They correspond OHLC abbreviation:
  open: number;
  high: number;
  low: number;
  close: number;
};
