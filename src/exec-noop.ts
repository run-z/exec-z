/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import { noop } from '@proc7ts/primitives';
import { zExecutionDone } from './exec-done.impl';
import type { ZExecution } from './execution';

/**
 * @internal
 */
const noopZExecution: ZExecution = {
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
export function execZNoOp(): ZExecution {
  return noopZExecution;
}
