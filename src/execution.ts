/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
/**
 * Arbitrary execution that can be aborted.
 *
 * @typeparam TResult  Execution result type.
 */
export interface ZExecution<TResult = void> {

  /**
   * Awaits for execution to start.
   *
   * @returns A promise resolved when execution started, or rejected when it is aborted before being started.
   */
  whenStarted(): Promise<void>;

  /**
   * Awaits for execution to finish.
   *
   * @returns A promise resolved when execution succeed, or rejected when it is failed.
   */
  whenDone(): Promise<TResult>;

  /**
   * Aborts the execution.
   */
  abort(): void;

}
