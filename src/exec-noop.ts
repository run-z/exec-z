/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import { noop } from '@proc7ts/primitives';
import type { DelayedZExecution } from './delayed-execution';

/**
 * @internal
 */
export const zExecutionDone = Promise.resolve();

/**
 * @internal
 */
const noopZExecution: DelayedZExecution<any> = {
  abort: noop,
  whenStarted() {
    return zExecutionDone;
  },
  whenDone() {
    return zExecutionDone;
  },
};

/**
 * Performs no-op execution.
 *
 * @typeparam TResult  Execution result type.
 *
 * @returns Already completed execution instance.
 */
export function execZNoop<TResult>(): DelayedZExecution<TResult> {
  return noopZExecution;
}
