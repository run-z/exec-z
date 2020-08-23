/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import * as os from 'os';
import { AbortedZExecutionError } from './aborted-execution-error';
import type { ZExecutionStarter } from './exec';
import { execZ } from './exec';
import type { ZExecution } from './execution';
import { failZ } from './fail';

/**
 * Constructs execution pool.
 *
 * @typeparam TResult  Execution result type.
 * @param maxRunning  The maximum number of simultaneously running executions. Zero or negative value means no limit.
 * Equals to the number of CPUs by default.
 *
 * @returns A function accepting execution starter and returning started or pending execution.
 */
export function poolZExecutions<TResult>(
    maxRunning = os.cpus().length,
): (this: void, starter: ZExecutionStarter<TResult>) => ZExecution<TResult> {
  if (maxRunning <= 0) {
    return execZ;
  }

  const queue: (() => void)[] = [];
  const whenReady = (): Promise<void> => {
    if (maxRunning > 0) {
      // Reduce the number of simultaneous executions and execute immediately
      --maxRunning;
      return Promise.resolve();
    }

    // Enqueue execution
    return new Promise(resolve => {
      queue.push(resolve);
    });
  };
  const execEnd = (): void => {

    const next = queue.shift();

    if (next) {
      // Execute next queued
      // The number of running jobs is not changed
      next();
    } else {
      // No more executions in queue
      // Allow one more simultaneous execution
      ++maxRunning;
    }
  };

  return starter => execZ(() => {

    let start = starter;
    let abort = (): void => {
      start = () => failZ<TResult>(new AbortedZExecutionError());
    };

    const whenStarted = whenReady();

    return {
      whenStarted() {
        return whenStarted;
      },
      whenDone() {
        return whenStarted.then(async () => {

          const execution = execZ(start);

          abort = () => execution.abort();

          return execution.whenDone();
        }).finally(execEnd);
      },
      abort() {
        abort();
      },
    };
  });
}
