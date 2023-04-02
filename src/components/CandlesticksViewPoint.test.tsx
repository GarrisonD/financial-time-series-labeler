/* eslint-disable testing-library/await-async-query */

import TestRenderer from "react-test-renderer";

import CandlesticksViewPointContext from "contexts/CandlesticksViewPoint";

import useCandlesticksFile from "hooks/high-level/useCandlesticksFile";
import usePixiDimensions from "hooks/high-level/usePixiDimensions";

import CandlesticksViewPoint from "./CandlesticksViewPoint";

jest.mock("hooks/high-level/useCandlesticksFile");
jest.mock("hooks/high-level/usePixiDimensions");

const ARROW_LEFT_EVENT = new KeyboardEvent("keydown", { code: "ArrowLeft" });
const ARROW_RIGHT_EVENT = new KeyboardEvent("keydown", { code: "ArrowRight" });

const Stub = (_: any) => null;

const Test = () => (
  <CandlesticksViewPoint>
    <CandlesticksViewPointContext.Consumer>
      {(viewPoint) => <Stub {...viewPoint} />}
    </CandlesticksViewPointContext.Consumer>
  </CandlesticksViewPoint>
);

beforeEach(() => {
  (usePixiDimensions as jest.Mock).mockReturnValue({ width: 12 });
});

describe("when candlesticks are centered", () => {
  beforeEach(() => {
    (useCandlesticksFile as jest.Mock).mockReturnValue({
      file: { candlesticks: { length: 1 } },
    });
  });

  it("pressing left and right arrow keys does nothing", () => {
    let renderer: TestRenderer.ReactTestRenderer;

    TestRenderer.act(() => {
      renderer = TestRenderer.create(<Test />);
    });

    const stub = renderer!.root.findByType(Stub);

    const initialStubProps = stub.props;
    expect(initialStubProps.centered).toEqual(true);
    expect(initialStubProps.firstVisibleCandlestickIndex).toEqual(0);

    TestRenderer.act(() => {
      window.dispatchEvent(ARROW_LEFT_EVENT);
    });
    expect(stub.props).toEqual(initialStubProps);

    TestRenderer.act(() => {
      window.dispatchEvent(ARROW_RIGHT_EVENT);
    });
    expect(stub.props).toEqual(initialStubProps);
  });
});

describe("when candlesticks are not centered", () => {
  beforeEach(() => {
    (useCandlesticksFile as jest.Mock).mockReturnValue({
      file: { candlesticks: { length: 5 } },
    });
  });

  it("pressing left and right arrow keys scrolls the chart", () => {
    let renderer: TestRenderer.ReactTestRenderer;

    TestRenderer.act(() => {
      renderer = TestRenderer.create(<Test />);
    });

    const stub = renderer!.root.findByType(Stub);

    const initialStubProps = stub.props;
    expect(initialStubProps.centered).toEqual(false);
    expect(initialStubProps.firstVisibleCandlestickIndex).toEqual(0);

    TestRenderer.act(() => {
      window.dispatchEvent(ARROW_RIGHT_EVENT);
    });
    expect(stub.props.firstVisibleCandlestickIndex).toEqual(3);

    TestRenderer.act(() => {
      window.dispatchEvent(ARROW_LEFT_EVENT);
    });
    expect(stub.props.firstVisibleCandlestickIndex).toEqual(0);
  });
});
