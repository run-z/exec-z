/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import { noop } from '@proc7ts/primitives';
import { AbortedZExecutionError } from './aborted-execution-error';
import { execZ, ZExecutionStarter } from './exec';
import type { ZExecution } from './execution';

/**
 * Performs execution after previous one succeed.
 *
 * @typeparam TResult  Second execution result type.
 * @param first  Execution to complete first.
 * @param next  Next execution starter function.
 *
 * @returns New execution instance started when the first one completes.
 */
export function execZAfter<TResult>(
    first: ZExecution<unknown>,
    next: ZExecutionStarter<TResult>,
): ZExecution<TResult> {

  const whenFirstDone = first.whenDone();

  return execZ(() => {

    let abort: () => void;
    let startNext = async (): Promise<TResult> => {

      const exec = execZ(next);

      abort = () => {
        abort = noop;
        exec.abort();
      };

      return exec.whenDone();
    };

    abort = (): void => {
      abort = noop;
      startNext = () => whenFirstDone.then(() => Promise.reject(new AbortedZExecutionError()));
      first.abort();
    };

    return {
      whenStarted() {
        return whenFirstDone;
      },
      whenDone() {
        return whenFirstDone.then(() => startNext());
      },
      abort() {
        abort();
      },
    };
  });
}
