/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import { noop, valueProvider } from '@proc7ts/primitives';
import { execZ, ZExecutionStarter } from './exec';
import type { ZExecution } from './execution';

/**
 * Performs execution after previous one succeed.
 *
 * @param first  Execution to complete first.
 * @param next  Next execution starter function.
 *
 * @returns New execution instance.
 */
export function execZAfter(
    first: ZExecution,
    next: ZExecutionStarter,
): ZExecution {

  const whenFirstDone = first.whenDone();

  return execZ(() => {

    let abort: () => void;
    let startNext = async (): Promise<void> => {

      const proc = execZ(next);

      abort = () => {
        abort = noop;
        proc.abort();
      };

      return proc.whenDone();
    };

    abort = (): void => {
      abort = noop;
      startNext = valueProvider(whenFirstDone);
      first.abort();
    };

    return {
      whenDone() {
        return whenFirstDone.then(() => startNext());
      },
      abort() {
        abort();
      },
    };
  });
}
