import { asis, noop } from '@proc7ts/primitives';
import { execZ } from './exec.js';
import type { ZExecution } from './execution.js';

/**
 * Performs execution that succeeds when all the given executions do, or fails when either of them fail.
 *
 * Aborts other executions once one of them fail.
 *
 * @typeParam T1  First execution result type.
 * @typeParam T2  Second execution result type.
 * @param executions - An iterable of executions.
 *
 * @returns New execution instance.
 */
export function execZAll<T1, T2>(
  executions: readonly [ZExecution<T1>, ZExecution<T2>],
): ZExecution<[T1, T2]>;

/**
 * Performs execution that succeeds when all the given executions do, or fails when either of them fail.
 *
 * Aborts other executions once one of them fail.
 *
 * @typeParam T1  First execution result type.
 * @typeParam T2  Second execution result type.
 * @typeParam T  Execution results combination type.
 * @param executions - An iterable of executions.
 * @param combine - Combiner function accepting execution results array and returning their combination.
 *
 * @returns New execution instance.
 */
export function execZAll<T1, T2, T>(
  executions: readonly [ZExecution<T1>, ZExecution<T2>],
  combine: (this: void, results: [T1, T2]) => T | PromiseLike<T>,
): ZExecution<T>;

export function execZAll<T1, T2, T3>(
  executions: readonly [ZExecution<T1>, ZExecution<T2>, ZExecution<T3>],
): ZExecution<[T1, T2, T3]>;

export function execZAll<T1, T2, T3, T>(
  executions: readonly [ZExecution<T1>, ZExecution<T2>, ZExecution<T3>],
  combine: (this: void, results: [T1, T2, T3]) => T | PromiseLike<T>,
): ZExecution<T>;

export function execZAll<T1, T2, T3>(
  executions: readonly [ZExecution<T1>, ZExecution<T2>, ZExecution<T3>],
): ZExecution<[T1, T2, T3]>;

export function execZAll<T1, T2, T3, T4>(
  executions: readonly [ZExecution<T1>, ZExecution<T2>, ZExecution<T3>, ZExecution<T4>],
): ZExecution<[T1, T2, T3, T4]>;

export function execZAll<T1, T2, T3, T4, T>(
  executions: readonly [ZExecution<T1>, ZExecution<T2>, ZExecution<T3>, ZExecution<T4>],
  combine: (this: void, results: [T1, T2, T3, T4]) => T | PromiseLike<T>,
): ZExecution<T>;

export function execZAll<T1, T2, T3, T4, T5>(
  executions: readonly [
    ZExecution<T1>,
    ZExecution<T2>,
    ZExecution<T3>,
    ZExecution<T4>,
    ZExecution<T5>,
  ],
): ZExecution<[T1, T2, T3, T4, T5]>;

export function execZAll<T1, T2, T3, T4, T5, T>(
  executions: readonly [
    ZExecution<T1>,
    ZExecution<T2>,
    ZExecution<T3>,
    ZExecution<T4>,
    ZExecution<T5>,
  ],
  combine: (this: void, results: [T1, T2, T3, T4, T5]) => T | PromiseLike<T>,
): ZExecution<[T1, T2, T3, T4, T5, T]>;

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

export function execZAll<T1, T2, T3, T4, T5, T6, T>(
  executions: readonly [
    ZExecution<T1>,
    ZExecution<T2>,
    ZExecution<T3>,
    ZExecution<T4>,
    ZExecution<T5>,
    ZExecution<T6>,
  ],
  combine: (this: void, results: [T1, T2, T3, T4, T5, T6]) => T | PromiseLike<T>,
): ZExecution<T>;

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

export function execZAll<T1, T2, T3, T4, T5, T6, T7, T>(
  executions: readonly [
    ZExecution<T1>,
    ZExecution<T2>,
    ZExecution<T3>,
    ZExecution<T4>,
    ZExecution<T5>,
    ZExecution<T6>,
    ZExecution<T7>,
  ],
  combine: (this: void, results: [T1, T2, T3, T4, T5, T6, T7]) => T | PromiseLike<T>,
): ZExecution<T>;

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

export function execZAll<T1, T2, T3, T4, T5, T6, T7, T8, T>(
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
  combine: (this: void, results: [T1, T2, T3, T4, T5, T6, T7, T8]) => T | PromiseLike<T>,
): ZExecution<T>;

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

export function execZAll<T1, T2, T3, T4, T5, T6, T7, T8, T9, T>(
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
  combine: (this: void, results: [T1, T2, T3, T4, T5, T6, T7, T8, T9]) => T | PromiseLike<T>,
): ZExecution<T>;

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

export function execZAll<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T>(
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
  combine: (this: void, results: [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]) => T | PromiseLike<T>,
): ZExecution<T>;

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

export function execZAll<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T>(
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
  combine: (
    this: void,
    results: [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11],
  ) => T | PromiseLike<T>,
): ZExecution<T>;

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

export function execZAll<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T>(
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
  combine: (
    this: void,
    results: [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12],
  ) => T | PromiseLike<T>,
): ZExecution<[T]>;

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

export function execZAll<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T>(
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
  combine: (
    this: void,
    results: [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13],
  ) => T | PromiseLike<T>,
): ZExecution<T>;

/**
 * Performs execution that succeeds when all of the given executions do, or fails when either of them fail.
 *
 * Aborts other executions once one of them fail.
 *
 * @typeParam TResult  Executions result type.
 * @param executions - An iterable of executions.
 *
 * @returns New execution instance.
 */
export function execZAll<TResult>(executions: Iterable<ZExecution<TResult>>): ZExecution<TResult[]>;

/**
 * Performs execution that succeeds when all the given executions do, or fails when either of them fail, then
 * combines the results.
 *
 * Aborts other executions once one of them fail.
 *
 * @typeParam TResult  Executions result type.
 * @typeParam TCombination  Execution results combination type.
 * @param executions - An iterable of executions.
 * @param combine - Combiner function accepting execution results array and returning their combination.
 *
 * @returns New execution instance.
 */
export function execZAll<TResult, TCombination>(
  executions: Iterable<ZExecution<TResult>>,
  combine: (this: void, results: readonly TResult[]) => TCombination | PromiseLike<TCombination>,
): ZExecution<TCombination>;

export function execZAll<TResult, TCombination>(
  executions: Iterable<ZExecution<TResult>>,
  combine: (results: any) => TCombination | PromiseLike<TCombination> = asis as () => TCombination,
): ZExecution<TCombination> {
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
      whenStarted() {
        return Promise.all(Array.from(toAbort, exec => exec.whenStarted()));
      },
      whenDone() {
        return Promise.all(
          Array.from(toAbort, exec =>
            exec.whenDone().catch(error => {
              fail(exec);

              return Promise.reject(error);
            }),
          ),
        ).then(combine);
      },
      abort,
    };
  });
}
