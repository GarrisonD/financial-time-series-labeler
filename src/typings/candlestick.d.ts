type Candlestick = {
  index: number;

  timestamp: number;

  // DO NOT SORT THE PROPERTIES BELOW!
  // It corresponds OHLC abbreviation:
  open: number;
  high: number;
  low: number;
  close: number;

  volume: number;
};

type NamedCandlesticks = { name: string; candlesticks: Candlestick[] };
