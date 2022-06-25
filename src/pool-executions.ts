import { noop } from '@proc7ts/primitives';
import * as os from 'node:os';
import { AbortedZExecutionError } from './aborted-execution-error';
import type { ZExecutionStarter } from './exec';
import { execZ } from './exec';
import type { ZExecution } from './execution';
import { failZ } from './fail';

/**
 * Constructs execution pool.
 *
 * @typeparam TResult  Execution result type.
 * @param maxRunning - The maximum number of simultaneously running executions. Zero or negative value means no limit.
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

    let start: () => void = noop;
    let dontStart: (error: unknown) => void = noop;
    const whenStarted = (): Promise<void> => new Promise<void>(((resolve, reject) => {
      start = resolve;
      dontStart = reject;
    }));

    let abort = (): void => {

      const aborted = new AbortedZExecutionError();

      starter = () => failZ<TResult>(aborted);
      dontStart(aborted);
    };

    const ready = whenReady();

    return {
      whenStarted() {
        return whenStarted();
      },
      whenDone() {
        return ready.then(() => {

          const execution = execZ(starter);

          abort = () => execution.abort();
          execution.whenStarted().then(() => start(), error => dontStart(error));

          return execution.whenDone();
        }).finally(execEnd);
      },
      abort() {
        abort();
      },
    };
  });
}
