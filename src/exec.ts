/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import { asyncByRecipe, lazyValue, noop, valueProvider } from '@proc7ts/primitives';
import { AbortedZExecutionError } from './aborted-execution-error';
import type { DelayedZExecution } from './delayed-execution';
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
 * @returns  Either execution instance, or a promise-like instance resolving to one.
 */
    (this: void) => ZExecution<TResult> | PromiseLike<ZExecution<TResult>>;

/**
 * Starts execution by the given starter.
 *
 * @typeparam TResult  Execution result type.
 * @param starter  Execution starter function.
 *
 * @returns Execution instance delayed until starter completes its work.
 */
export function execZ<TResult>(starter: ZExecutionStarter<TResult>): DelayedZExecution<TResult> {

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

  let initialize: (started: ZExecution<TResult>) => void;
  let abort = (): void => {
    abort = noop;
    initialize = init => {
      init.abort();
    };
    dontStart(new AbortedZExecutionError());
  };

  initialize = started => {
    initialize = noop;
    abort = () => {
      abort = noop;
      started.abort();
    };
    start();
  };

  const done = (): void => {
    abort = noop;
  };

  const whenDone: Promise<TResult> = asyncByRecipe(starter).then(
      started => {
        initialize(started);
        return started.whenDone().finally(done);
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
