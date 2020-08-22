/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import { asyncByRecipe, noop } from '@proc7ts/primitives';
import type { ZExecution } from './execution';

/**
 * Execution starter signature.
 *
 * Constructs new execution initializer.
 */
export type ZExecutionStarter =
/**
 * @returns  Either execution instance, or a promise-like instance resolving to one.
 */
    (this: void) => ZExecution | PromiseLike<ZExecution>;

/**
 * Starts execution by the given starter.
 *
 * @param starter  Execution process starter function.
 *
 * @returns Started execution instance.
 */
export function execZ(starter: ZExecutionStarter): ZExecution {

  let initialize: (init: ZExecution) => void;
  let abort = (): void => {
    abort = noop;
    initialize = init => {
      init.abort();
    };
  };

  initialize = init => {
    initialize = noop;
    abort = () => {
      abort = noop;
      init.abort();
    };
  };

  const done = (): void => {
    abort = noop;
  };

  const whenDone: Promise<void> = asyncByRecipe(starter).then(init => {
    initialize(init);
    return init.whenDone().finally(done);
  });

  return {
    whenDone() {
      return whenDone;
    },
    abort() {
      abort();
    },
  };
}
