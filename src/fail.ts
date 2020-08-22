/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import { noop } from '@proc7ts/primitives';
import type { DelayedZExecution } from './delayed-execution';
import { zExecutionDone } from './exec-noop';

/**
 * Performs failed execution.
 *
 * @param reason  A reason of execution failure.
 *
 * @returns Failed execution instance.
 */
export function failZ<TResult>(reason: any): DelayedZExecution<TResult> {

  const rejection = Promise.reject(reason);

  return {
    abort: noop,
    whenStarted() {
      return zExecutionDone;
    },
    whenDone() {
      return rejection;
    },
  };
}
