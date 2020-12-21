interface Drawer {
  draw: FrameRequestCallback;
}

/**
 * Instance of this class simplifies creating and destroying
 * of the infinite rendering (drawing) loop by using
 * `window.requestAnimationFrame(...)` and
 * `window.cancelAnimationFrame(...)`.
 *
 * Example usage:
 *
 * ```js
 * const someStubDrawer = {
 *   draw: () => console.log('Instead of drawing I am logging to console...')
 * }
 *
 * const infiniteDrawer = new InfiniteDrawer(someStubDrawer)
 *
 * infiniteDrawer.play()
 *
 * // ... after some time, for example, when React component is getting unmounted:
 *
 * infiniteDrawer.stop()
 * ```
 */
class InfiniteDrawer {
  /**
   * Identifier of the last request of animation frame.
   *
   * Used to stop the infinite drawing loop by canceling the last
   * requested animation frame.
   */
  #requestId?: number;

  #prevTimestamp?: number;

  /**
   * @param drawer Anything that implements {@link Drawer} interface.
   *               `drawer.draw` will be invoked in the infinite drawing loop.
   */
  constructor(readonly drawer: Drawer) {}

  /**
   * Starts the infinite drawing loop.
   */
  play() {
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

  /**
   * Stops the infinite drawing loop.
   */
  stop() {
    if (this.#requestId) {
      cancelAnimationFrame(this.#requestId);

      this.#requestId = undefined;
    }
  }
}

export default InfiniteDrawer;

export type { Drawer };
