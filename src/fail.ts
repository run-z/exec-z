import { noop } from '@proc7ts/primitives';
import { zExecutionDone } from './exec-done.impl';
import type { ZExecution } from './execution';

/**
 * Performs failed execution.
 *
 * @param reason - A reason of execution failure.
 *
 * @returns Failed execution instance.
 */
export function failZ<TResult>(reason: any): ZExecution<TResult> {

  const rejection = Promise.reject<TResult>(reason);

  return {
    whenStarted() {
      return zExecutionDone;
    },
    whenDone() {
      return rejection;
    },
    abort: noop,
  };
}
