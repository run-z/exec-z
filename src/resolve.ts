import { noop } from '@proc7ts/primitives';
import { zExecutionDone } from './exec-done.impl';
import type { ZExecution } from './execution';

/**
 * Performs successful execution.
 *
 * @param result - Either execution result or a promise-like instance resolving to one.
 *
 * @returns Successful execution instance.
 */
export function resolveZ<TResult>(result: TResult | PromiseLike<TResult>): ZExecution<TResult> {
  const resolution = Promise.resolve(result);

  return {
    whenStarted() {
      return zExecutionDone;
    },
    whenDone() {
      return resolution;
    },
    abort: noop,
  };
}
