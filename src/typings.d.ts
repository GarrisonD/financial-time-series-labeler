type OHLCRecord = {
  Timestamp: number;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
};

type OHLCFile = { name: string; records: OHLCRecord[] };
