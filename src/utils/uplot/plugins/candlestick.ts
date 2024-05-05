import { PartialDeep } from "type-fest";
import merge from "lodash/merge";
import uPlot from "uplot";

const SHADOW_COLOR = "#000000";

const BODY_BULLISH_COLOR = "#FFFFFF";
const BODY_BEARISH_COLOR = "#000000";

const LABELED_COLOR = "#eeeeee";

const CANVAS_PIXELS = true;

type Options = {
  gap: number;

  body: {
    outline: { width: number };
    width: { max: number };
  };

  shadow: { width: number };
};

const defaults: Options = {
  gap: 2,

  body: {
    outline: { width: 2 },
    width: { max: 20 },
  },

  shadow: { width: 1 },
};

const candlestick = (options: PartialDeep<Options> = {}): uPlot.Plugin => {
  const opts = merge({}, defaults, options);

  const draw: uPlot.Hooks.Defs["draw"] = (u) => {
    u.ctx.save();

    const [iMin, iMax] = u.series[0].idxs!;

    const { min: xMin, max: xMax } = u.scales.x;
    const columnWidth = u.bbox.width / (xMax! - xMin!);
    const bodyWidth = Math.min(opts.body.width.max, columnWidth - opts.gap);

    const { min: yMin, max: yMax } = u.scales.y;
    const yMinAsY = u.valToPos(yMin!, "y", CANVAS_PIXELS);
    const yMaxAsY = u.valToPos(yMax!, "y", CANVAS_PIXELS);
    const columnHeight = yMaxAsY - yMinAsY;

    for (let i = iMin; i <= iMax; i++) {
      // prettier-ignore
      const x       = u.data[0][i]!,
            open    = u.data[1][i]!,
            high    = u.data[2][i]!,
            low     = u.data[3][i]!,
            close   = u.data[4][i]!,
            labeled = u.data[5][i]!;

      // prettier-ignore
      const timeAsX  = u.valToPos(x,     "x", CANVAS_PIXELS),
            openAsY  = u.valToPos(open,  "y", CANVAS_PIXELS),
            highAsY  = u.valToPos(high,  "y", CANVAS_PIXELS),
            lowAsY   = u.valToPos(low,   "y", CANVAS_PIXELS),
            closeAsY = u.valToPos(close, "y", CANVAS_PIXELS);

      // Labeled background
      if (labeled) {
        u.ctx.fillStyle = LABELED_COLOR;
        const columnX = timeAsX - columnWidth / 2;
        u.ctx.fillRect(columnX, yMinAsY, columnWidth, columnHeight);
      }

      // Shadow
      const shadowHeight = Math.abs(highAsY - lowAsY);

      const shadowX = timeAsX - opts.shadow.width;
      const shadowY = Math.min(highAsY, lowAsY);

      u.ctx.fillStyle = SHADOW_COLOR;
      u.ctx.fillRect(
        Math.round(shadowX),
        Math.round(shadowY),
        Math.round(opts.shadow.width * 2),
        Math.round(shadowHeight),
      );

      // Outer Body
      const bodyHeight = Math.abs(closeAsY - openAsY);

      const bodyX = timeAsX - bodyWidth / 2;
      const bodyY = Math.min(closeAsY, openAsY);

      u.ctx.fillStyle = SHADOW_COLOR;
      u.ctx.fillRect(
        Math.round(bodyX),
        Math.round(bodyY),
        Math.round(bodyWidth),
        Math.round(bodyHeight),
      );

      // Inner Body
      const innerBodyHeight = bodyHeight - opts.body.outline.width * 2;
      const innerBodyWidth = bodyWidth - opts.body.outline.width * 2;

      const innerBodyColor =
        open > close ? BODY_BEARISH_COLOR : BODY_BULLISH_COLOR;

      if (innerBodyHeight > 0) {
        u.ctx.fillStyle = innerBodyColor;
        u.ctx.fillRect(
          Math.round(bodyX + opts.body.outline.width),
          Math.round(bodyY + opts.body.outline.width),
          Math.round(innerBodyWidth),
          Math.round(innerBodyHeight),
        );
      }
    }

    u.ctx.restore();
  };

  const setCursor: uPlot.Hooks.Defs["setCursor"] = (u) => {
    const idx = u.cursor.idx;

    if (idx != null) {
      // prettier-ignore
      const open  = u.data[1][idx]!,
            close = u.data[4][idx]!;

      // prettier-ignore
      const openAsY  = u.valToPos(open,  "y"),
            closeAsY = u.valToPos(close, "y");

      const [ySmaller, yBigger] =
        openAsY < closeAsY ? [openAsY, closeAsY] : [closeAsY, openAsY];

      if (u.cursor.top! >= ySmaller && u.cursor.top! <= yBigger) {
        u.over.style.cursor = "pointer";
        return;
      }
    }

    u.over.style.cursor = "default";
  };

  return { hooks: { draw, setCursor } };
};

export default candlestick;
