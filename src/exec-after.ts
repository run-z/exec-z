import { noop } from '@proc7ts/primitives';
import { AbortedZExecutionError } from './aborted-execution-error.js';
import { execZ, ZExecutionStarter } from './exec.js';
import type { ZExecution } from './execution.js';

/**
 * Performs execution after previous one succeed.
 *
 * @typeParam TFirstResult  First execution result type.
 * @typeParam TResult  Second execution result type.
 * @param first - Execution to complete first.
 * @param next - Next execution starter function accepting result of the first execution as its argument.
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

      return await exec.whenDone();
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
