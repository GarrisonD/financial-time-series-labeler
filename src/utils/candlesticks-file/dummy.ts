const File1: CandlesticksFile = {
  name: "Untitled",
  candlesticks: [
    {
      index: 0,
      timestamp: 0,
      low: 1,
      open: 2,
      close: 3,
      high: 4,
      volume: 1,
    },
  ],
};

const File2: CandlesticksFile = {
  name: "Untitled",
  candlesticks: [
    {
      index: 0,
      timestamp: 0,
      low: 1,
      open: 1.5,
      close: 2,
      high: 3,
      volume: 1,
    },
    {
      index: 1,
      timestamp: 1,
      low: 1.75,
      open: 2,
      close: 2.5,
      high: 2.75,
      volume: 1,
    },
    {
      index: 2,
      timestamp: 2,
      low: 1.25,
      open: 2.5,
      close: 1.5,
      high: 2.75,
      volume: 1,
    },
  ],
};

export { File1 as Set1, File2 as Set2 };
