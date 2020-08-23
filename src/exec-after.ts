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
 * @typeparam TFirstResult  First execution result type.
 * @typeparam TResult  Second execution result type.
 * @param first  Execution to complete first.
 * @param next  Next execution starter function accepting result of the first execution as its argument.
 *
 * @returns New execution instance started when the first one completes.
 */
export function execZAfter<TFirstResult, TResult>(
    first: ZExecution<TFirstResult>,
    next: ZExecutionStarter<TResult, [TFirstResult]>,
): ZExecution<TResult> {

  const whenFirstDone = first.whenDone();

  return execZ(() => {

    let abort: () => void;
    let startNext = async (firstResult: TFirstResult): Promise<TResult> => {

      const exec = execZ(() => next(firstResult));

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
        return whenFirstDone.then(firstResult => startNext(firstResult));
      },
      abort() {
        abort();
      },
    };
  });
}
