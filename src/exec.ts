import { asyncByRecipe, lazyValue, noop, valueProvider } from '@proc7ts/primitives';
import { AbortedZExecutionError } from './aborted-execution-error.js';
import type { ZExecution } from './execution.js';

/**
 * Execution starter signature.
 *
 * Constructs new execution initializer.
 *
 * @typeParam TResult  Execution result type.
 * @typeParam TArgs  Starter arguments tuple type.
 * @param args - Starter arguments.
 *
 * @returns  Either execution initializer, or a promise-like instance resolving to one.
 */
export type ZExecutionStarter<TResult = void, TArgs extends any[] = []> = (
  this: void,
  ...args: TArgs
) => ZExecutionInit<TResult> | PromiseLike<ZExecutionInit<TResult>>;

/**
 * Execution initializer.
 *
 * Returned from {@link ZExecutionStarter execution starter} to construct new executions.
 *
 * @typeParam TResult  Execution result type.
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
 * @typeParam TResult  Execution result type.
 * @param starter - Execution starter function.
 *
 * @returns New execution instance to start by the given starter.
 */
export function execZ<TResult>(starter: ZExecutionStarter<TResult>): ZExecution<TResult> {
  let start: () => void;
  let doNotStart: (error: unknown) => void;
  let whenStarted = (): Promise<void> => {
    const result = new Promise<void>((resolve, reject) => {
      start = resolve;
      doNotStart = reject;
    });

    whenStarted = valueProvider(result);

    return result;
  };

  start = () => {
    whenStarted = valueProvider(Promise.resolve());
  };
  doNotStart = (error: unknown): void => {
    whenStarted = lazyValue(() => Promise.reject(error));
  };

  let initialize: (init: ZExecutionInit<TResult>) => void;
  let abort = (): void => {
    abort = noop;
    initialize = init => {
      init.abort?.();
    };
    doNotStart(new AbortedZExecutionError());
  };

  initialize = init => {
    initialize = noop;
    abort = () => {
      abort = noop;
      init.abort?.();
    };
    Promise.resolve()
      .then(() => init.whenStarted?.())
      .then(
        () => start(),
        error => doNotStart(error),
      );
  };

  const done = (): void => {
    abort = noop;
  };

  const whenDone: Promise<TResult> = asyncByRecipe(starter)
    .then(init => {
      initialize(init);

      return Promise.resolve(init.whenDone()).finally(done);
    })
    .catch(error => {
      doNotStart(error);

      return Promise.reject(error);
    });

  return {
    whenStarted() {
      return whenStarted();
    },
    whenDone() {
      return whenDone;
    },
    abort() {
      abort();
    },
  };
}
