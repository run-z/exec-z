import { noop } from '@proc7ts/primitives';
import { zExecutionDone } from './exec-done.impl.js';
import type { ZExecution } from './execution.js';

/**
 * Performs failed execution.
 *
 * @param reason - A reason of execution failure.
 *
 * @returns Failed execution instance.
 */
export function failZ<TResult>(reason: unknown): ZExecution<TResult> {
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
