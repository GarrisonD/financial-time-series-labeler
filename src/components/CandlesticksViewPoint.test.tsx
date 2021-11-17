import TestRenderer from "react-test-renderer";

import * as PIXI from "pixi.js";

import CandlesticksFileContext from "contexts/CandlesticksFile";
import CandlesticksViewPointContext from "contexts/CandlesticksViewPoint";
import PIXIApplicationContext from "contexts/PIXIApplication";

import CandlesticksSettings from "./CandlesticksSettings";
import CandlesticksViewPoint from "./CandlesticksViewPoint";

const ARROW_LEFT_EVENT = new KeyboardEvent("keydown", { code: "ArrowLeft" });
const ARROW_RIGHT_EVENT = new KeyboardEvent("keydown", { code: "ArrowRight" });

const Stub = (_: any) => null;

let renderer: TestRenderer.ReactTestRenderer;

const setUp = (opts: { candlesticks: { count: number } }) => {
  TestRenderer.act(() => {
    renderer = TestRenderer.create(
      <CandlesticksSettings>
        <CandlesticksFileContext.Provider
          value={{
            file: {
              name: "Stub",
              candlesticks: Array(opts.candlesticks.count).fill([
                {
                  index: 0,
                  timestamp: 0,
                  open: 0,
                  high: 0,
                  low: 0,
                  close: 0,
                },
              ]),
            },
            setFile: jest.fn(),
          }}
        >
          <PIXIApplicationContext.Provider
            value={
              {
                renderer: {
                  screen: {
                    height: 12,
                    width: 12,
                  },
                },
              } as PIXI.Application
            }
          >
            <CandlesticksViewPoint>
              <CandlesticksViewPointContext.Consumer>
                {(viewPoint) => <Stub {...viewPoint} />}
              </CandlesticksViewPointContext.Consumer>
            </CandlesticksViewPoint>
          </PIXIApplicationContext.Provider>
        </CandlesticksFileContext.Provider>
      </CandlesticksSettings>
    );
  });
};

describe("when candlesticks are centered", () => {
  it("pressing left and right arrow keys does nothing", () => {
    setUp({ candlesticks: { count: 1 } });

    const stub = renderer!.root.findByType(Stub);
    const initialStubProps = stub.props;

    expect(initialStubProps).toMatchObject({
      centered: true,
      //
      firstVisibleCandlestickIndex: 0,
      lastVisibleCandlestickIndex: 1,
    });

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
  it("pressing left and right arrow keys scrolls the chart", () => {
    setUp({ candlesticks: { count: 5 } });

    const stub = renderer!.root.findByType(Stub);
    const initialStubProps = stub.props;

    expect(initialStubProps).toMatchObject({
      centered: false,
      //
      firstVisibleCandlestickIndex: 0,
      lastVisibleCandlestickIndex: 2,
    });

    TestRenderer.act(() => {
      window.dispatchEvent(ARROW_RIGHT_EVENT);
    });
    expect(stub.props).toMatchObject({
      centered: false,
      //
      firstVisibleCandlestickIndex: 3,
      lastVisibleCandlestickIndex: 5,
    });

    TestRenderer.act(() => {
      window.dispatchEvent(ARROW_LEFT_EVENT);
    });
    expect(stub.props).toEqual(initialStubProps);
  });
});
