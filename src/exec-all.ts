/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import { mapIt } from '@proc7ts/a-iterable';
import { noop } from '@proc7ts/primitives';
import { execZ } from './exec';
import type { ZExecution } from './execution';

/**
 * Performs execution that succeeds when all of the given executions do, or fails when either of them fail.
 *
 * Aborts other executions once one of them fail.
 *
 * @param executions  An iterable of executions.
 *
 * @returns New execution instance.
 */
export function execZAll(executions: Iterable<ZExecution>): ZExecution {
  return execZ(() => {

    const toAbort = new Set<ZExecution>(executions);
    const abort = (): void => {
      for (const exec of toAbort) {
        exec.abort();
      }
      toAbort.clear();
    };
    let fail = (exec: ZExecution): void => {
      fail = noop;
      toAbort.delete(exec);
      abort();
    };

    return {
      whenDone(): Promise<void> {
        return Promise.all(mapIt(
            toAbort,
            exec => exec.whenDone().catch(error => {
              fail(exec);
              return Promise.reject(error);
            }),
        )).then(noop);
      },
      abort,
    };
  });
}
