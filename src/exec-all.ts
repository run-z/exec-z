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
 * @typeparam T1  First execution result type.
 * @typeparam T2  Second execution result type.
 * @param executions  An iterable of executions.
 *
 * @returns New execution instance.
 */
export function execZAll<T1, T2>(
    executions: readonly [
      ZExecution<T1>,
      ZExecution<T2>,
    ],
): ZExecution<[T1, T2]>;

export function execZAll<T1, T2, T3>(
    executions: readonly [
      ZExecution<T1>,
      ZExecution<T2>,
      ZExecution<T3>,
    ],
): ZExecution<[T1, T2, T3]>;

export function execZAll<T1, T2, T3>(
    executions: readonly [
      ZExecution<T1>,
      ZExecution<T2>,
      ZExecution<T3>,
    ],
): ZExecution<[T1, T2, T3]>;

export function execZAll<T1, T2, T3, T4>(
    executions: readonly [
      ZExecution<T1>,
      ZExecution<T2>,
      ZExecution<T3>,
      ZExecution<T4>,
    ],
): ZExecution<[T1, T2, T3, T4]>;

export function execZAll<T1, T2, T3, T4, T5>(
    executions: readonly [
      ZExecution<T1>,
      ZExecution<T2>,
      ZExecution<T3>,
      ZExecution<T4>,
      ZExecution<T5>,
    ],
): ZExecution<[T1, T2, T3, T4, T5]>;

export function execZAll<T1, T2, T3, T4, T5, T6>(
    executions: readonly [
      ZExecution<T1>,
      ZExecution<T2>,
      ZExecution<T3>,
      ZExecution<T4>,
      ZExecution<T5>,
      ZExecution<T6>,
    ],
): ZExecution<[T1, T2, T3, T4, T5, T6]>;

export function execZAll<T1, T2, T3, T4, T5, T6, T7>(
    executions: readonly [
      ZExecution<T1>,
      ZExecution<T2>,
      ZExecution<T3>,
      ZExecution<T4>,
      ZExecution<T5>,
      ZExecution<T6>,
      ZExecution<T7>,
    ],
): ZExecution<[T1, T2, T3, T4, T5, T6, T7]>;

export function execZAll<T1, T2, T3, T4, T5, T6, T7, T8>(
    executions: readonly [
      ZExecution<T1>,
      ZExecution<T2>,
      ZExecution<T3>,
      ZExecution<T4>,
      ZExecution<T5>,
      ZExecution<T6>,
      ZExecution<T7>,
      ZExecution<T8>,
    ],
): ZExecution<[T1, T2, T3, T4, T5, T6, T7, T8]>;

export function execZAll<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    executions: readonly [
      ZExecution<T1>,
      ZExecution<T2>,
      ZExecution<T3>,
      ZExecution<T4>,
      ZExecution<T5>,
      ZExecution<T6>,
      ZExecution<T7>,
      ZExecution<T8>,
      ZExecution<T9>,
    ],
): ZExecution<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;

export function execZAll<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    executions: readonly [
      ZExecution<T1>,
      ZExecution<T2>,
      ZExecution<T3>,
      ZExecution<T4>,
      ZExecution<T5>,
      ZExecution<T6>,
      ZExecution<T7>,
      ZExecution<T8>,
      ZExecution<T9>,
      ZExecution<T10>,
    ],
): ZExecution<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;

export function execZAll<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
    executions: readonly [
      ZExecution<T1>,
      ZExecution<T2>,
      ZExecution<T3>,
      ZExecution<T4>,
      ZExecution<T5>,
      ZExecution<T6>,
      ZExecution<T7>,
      ZExecution<T8>,
      ZExecution<T9>,
      ZExecution<T10>,
      ZExecution<T11>,
    ],
): ZExecution<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11]>;

export function execZAll<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(
    executions: readonly [
      ZExecution<T1>,
      ZExecution<T2>,
      ZExecution<T3>,
      ZExecution<T4>,
      ZExecution<T5>,
      ZExecution<T6>,
      ZExecution<T7>,
      ZExecution<T8>,
      ZExecution<T9>,
      ZExecution<T10>,
      ZExecution<T11>,
      ZExecution<T12>,
    ],
): ZExecution<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12]>;

export function execZAll<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(
    executions: readonly [
      ZExecution<T1>,
      ZExecution<T2>,
      ZExecution<T3>,
      ZExecution<T4>,
      ZExecution<T5>,
      ZExecution<T6>,
      ZExecution<T7>,
      ZExecution<T8>,
      ZExecution<T9>,
      ZExecution<T10>,
      ZExecution<T11>,
      ZExecution<T12>,
      ZExecution<T13>,
    ],
): ZExecution<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13]>;

/**
 * Performs execution that succeeds when all of the given executions do, or fails when either of them fail.
 *
 * Aborts other executions once one of them fail.
 *
 * @typeparam TResult  Executions result type.
 * @param executions  An iterable of executions.
 *
 * @returns New execution instance.
 */
export function execZAll<TResult>(executions: Iterable<ZExecution<TResult>>): ZExecution<TResult[]>;

export function execZAll<TResult>(executions: Iterable<ZExecution<TResult>>): ZExecution<TResult[]> {
  return execZ(() => {

    const toAbort = new Set<ZExecution<TResult>>(executions);
    const abort = (): void => {
      for (const exec of toAbort) {
        exec.abort();
      }
      toAbort.clear();
    };
    let fail = (exec: ZExecution<TResult>): void => {
      fail = noop;
      toAbort.delete(exec);
      abort();
    };

    return {
      whenDone(): Promise<TResult[]> {
        return Promise.all(mapIt(
            toAbort,
            exec => exec.whenDone().catch(error => {
              fail(exec);
              return Promise.reject(error);
            }),
        ));
      },
      abort,
    };
  });
}
