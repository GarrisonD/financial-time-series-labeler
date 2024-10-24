const File1: CandlesticksFile = {
  name: "Untitled",
  candlesticks: [
    {
      index: 0,
      timestamp: "2019-01-01 22:00:00+00:00",
      low: 1,
      open: 2,
      close: 3,
      high: 4,
    },
  ],
};

const File2: CandlesticksFile = {
  name: "Untitled",
  candlesticks: [
    {
      index: 0,
      timestamp: "2019-01-01 22:00:00+00:00",
      low: 1,
      open: 1.5,
      close: 2,
      high: 3,
    },
    {
      index: 1,
      timestamp: "2019-01-01 23:00:00+00:00",
      low: 1.75,
      open: 2,
      close: 2.5,
      high: 2.75,
    },
    {
      index: 2,
      timestamp: "2019-01-02 00:00:00+00:00",
      low: 1.25,
      open: 2.5,
      close: 1.5,
      high: 2.75,
    },
  ],
};

export { File1, File2 };
