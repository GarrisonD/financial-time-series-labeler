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
   * Anything that implements {@link Drawer} interface.
   *
   * Method `draw` will be invoked in the infinite drawing loop.
   */
  private drawer: Drawer;

  /**
   * Identifier of the last request of animation frame.
   *
   * Used to stop the infinite drawing loop by canceling the last
   * requested animation frame.
   */
  private requestId?: number;

  private prevTimestamp?: number;

  /**
   * @param drawer Anything that implements {@link Drawer} interface.
   */
  constructor(drawer: Drawer) {
    this.drawer = drawer;
  }

  /**
   * Starts the infinite drawing loop.
   */
  play() {
    this.requestId = requestAnimationFrame((...args) => {
      this.drawer.draw(...args);

      this.play();

      const timestamp = args[0];

      if (this.prevTimestamp) {
        const timestampDiff = timestamp - this.prevTimestamp;

        if (timestampDiff > 1000 / 55) {
          console.warn(
            `Frame rate drop! ${Math.round(timestampDiff)} ms = ${Math.round(
              1000 / timestampDiff
            )} FPS`
          );
        }
      }

      this.prevTimestamp = timestamp;
    });
  }

  /**
   * Stops the infinite drawing loop.
   */
  stop() {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);

      this.requestId = undefined;
    }
  }
}

export default InfiniteDrawer;

export type { Drawer };
