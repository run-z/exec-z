/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import { asyncByRecipe, lazyValue, noop, valueProvider } from '@proc7ts/primitives';
import { AbortedZExecutionError } from './aborted-execution-error';
import type { ZExecution } from './execution';

/**
 * Execution starter signature.
 *
 * Constructs new execution initializer.
 *
 * @typeparam TResult  Execution result type.
 */
export type ZExecutionStarter<TResult = void> =
/**
 * @returns  Either execution initializer, or a promise-like instance resolving to one.
 */
    (this: void) => ZExecutionInit<TResult> | PromiseLike<ZExecutionInit<TResult>>;

/**
 * Execution initializer.
 *
 * Returned from {@link ZExecutionStarter execution starter} to construct new executions.
 *
 * @typeparam TResult  Execution result type.
 */
export interface ZExecutionInit<TResult> {

  /**
   * Constructs a promise resolved when execution starts.
   *
   * When omitted the execution is started when starter finishes its work.
   *
   * @returns Either none, or a promise-like instance resolved when execution started, or rejected when it is aborted
   * before being started.
   */
  whenStarted?(): void | PromiseLike<unknown>;

  /**
   * Constructs a promise that resolves to execution result.
   *
   * @returns Either execution result, or a promise-like instance resolved to the one.
   */
  whenDone(): TResult | PromiseLike<TResult>;

  /**
   * Aborts the execution.
   *
   * When omitted the execution won't be aborted
   */
  abort?(): void;

}

/**
 * Starts execution by the given starter.
 *
 * @typeparam TResult  Execution result type.
 * @param starter  Execution starter function.
 *
 * @returns New execution instance to start by the given starter.
 */
export function execZ<TResult>(
    starter: ZExecutionStarter<TResult>,
): ZExecution<TResult> {

  let start: () => void;
  let dontStart: (error: any) => void;
  let whenStarted = (): Promise<void> => {

    const result = new Promise<void>((resolve, reject) => {
      start = resolve;
      dontStart = reject;
    });

    whenStarted = valueProvider(result);

    return result;
  };

  start = () => {
    whenStarted = valueProvider(Promise.resolve());
  };
  dontStart = (error: any): void => {
    whenStarted = lazyValue(() => Promise.reject(error));
  };

  let initialize: (init: ZExecutionInit<TResult>) => void;
  let abort = (): void => {
    abort = noop;
    initialize = init => {
      init.abort?.();
    };
    dontStart(new AbortedZExecutionError());
  };

  initialize = init => {
    initialize = noop;
    abort = () => {
      abort = noop;
      init.abort?.();
    };
    Promise.resolve(init.whenStarted?.()).then(start, dontStart);
  };

  const done = (): void => {
    abort = noop;
  };

  const whenDone: Promise<TResult> = asyncByRecipe(starter).then(
      init => {
        initialize(init);
        return Promise.resolve(init.whenDone()).finally(done);
      },
  ).catch(
      error => {
        dontStart(error);
        return Promise.reject(error);
      },
  );

  return {
    whenDone() {
      return whenDone;
    },
    whenStarted() {
      return whenStarted();
    },
    abort() {
      abort();
    },
  };
}
