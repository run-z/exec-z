/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import { noop } from '@proc7ts/primitives';
import type { ZExecution } from './execution';

/**
 * @internal
 */
const zExecutionDone = Promise.resolve();

/**
 * @internal
 */
const noopZExecution: ZExecution = {
  abort: noop,
  whenDone(): Promise<void> {
    return zExecutionDone;
  },
};

/**
 * Performs no-op execution.
 *
 * @returns Already completed execution instance.
 */
export function execZNoop(): ZExecution {
  return noopZExecution;
}
