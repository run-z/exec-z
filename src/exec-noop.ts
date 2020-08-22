/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import { noop } from '@proc7ts/primitives';
import type { DelayedZExecution } from './delayed-execution';
import { zExecutionDone } from './exec-done.impl';

/**
 * @internal
 */
const noopZExecution: DelayedZExecution = {
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
export function execZNoOp(): DelayedZExecution {
  return noopZExecution;
}
