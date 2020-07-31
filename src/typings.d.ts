type Candlestick = {
  Timestamp: number;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
};

type NamedCandlesticks = { name: string; candlesticks: Candlestick[] };
