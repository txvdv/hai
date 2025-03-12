/**
 * Utility to wait until the next tick of the event loop, ensuring that any pending asynchronous
 * operations (like Promises or mock requests) are resolved before proceeding. This is particularly
 * useful in testing environments where you need to wait for a mocked asynchronous operation to settle
 * before asserting test results.
 *
 * How it works:
 * - A `Promise` represents a value that will resolve asynchronously in the future.
 * - `setImmediate` schedules a function to execute after the current event loop finishes,
 *   but before any additional I/O or timers are processed (next tick of the event loop).
 * - If `setImmediate` is not available (e.g., in some browsers or Jest), we fall back to `setTimeout(func, 0)`.
 *
 * Notes:
 * - This utility only works for mocked async operations resolving immediately.
 * - It's intended for testing purposes only.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate
 * @readonly
 */
export function flushPromises(): Promise<void> {
  return new Promise<void>((complete: () => void) => {
    // If `setImmediate` is not defined in the current environment, fall back to `setTimeout`
    const setImmediateOrFallback =
      typeof setImmediate === "function"
        ? setImmediate
        : (fn: () => void) => setTimeout(fn, 0)

    setImmediateOrFallback(complete)
  })
}
