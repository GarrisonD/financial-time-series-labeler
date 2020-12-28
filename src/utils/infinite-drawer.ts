interface Drawer {
  draw: FrameRequestCallback;
}

class InfiniteDrawer {
  #requestId?: number;
  #prevTimestamp?: number;

  constructor(readonly drawer: Drawer) {}

  play(): void {
    this.#requestId = requestAnimationFrame((timestamp: number) => {
      this.drawer.draw(timestamp);

      this.play();

      if (this.#prevTimestamp) {
        const timestampDiff = timestamp - this.#prevTimestamp;

        if (timestampDiff > 1000 / 55) {
          console.warn(
            [
              "FPS drop detected!",
              "Frame took " + Math.round(timestampDiff) + " ms.",
              "It's about " + Math.round(1000 / timestampDiff) + " FPS.",
            ].join(" ")
          );
        }
      }

      this.#prevTimestamp = timestamp;
    });
  }

  stop(): void {
    if (this.#requestId) {
      cancelAnimationFrame(this.#requestId);

      this.#requestId = undefined;
    }
  }
}

export default InfiniteDrawer;

export type { Drawer };
