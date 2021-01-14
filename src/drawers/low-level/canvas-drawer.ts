type Canvas = HTMLCanvasElement | OffscreenCanvas;

class CanvasDrawer {
  private static readonly GET_CONTEXT_FAILED =
    "Failed to get Canvas 2D rendering context!";

  #context?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

  constructor(
    private readonly canvas: Canvas,
    private readonly opts: { scale: number }
  ) {}

  get context() {
    if (this.#context == null) {
      const context = this.canvas.getContext("2d", {
        desynchronized: true,
        alpha: true,
      });

      if (context == null) throw new Error(CanvasDrawer.GET_CONTEXT_FAILED);

      // prettier-ignore
      context.scale(
        this.opts.scale,
        this.opts.scale
      );

      this.#context = context;
    }

    return this.#context;
  }

  get height() {
    return this.canvas.height / this.opts.scale;
  }

  get width() {
    return this.canvas.width / this.opts.scale;
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }
}

export default CanvasDrawer;
