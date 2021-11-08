import useCandlesticksFile from "./useCandlesticksFile";

const useCandlesticks = () => {
  const { file } = useCandlesticksFile();

  return file.candlesticks;
};

export default useCandlesticks;
