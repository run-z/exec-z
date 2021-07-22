/**
 * Error raised when execution aborted for some predictable reason.
 *
 * E.g. when {@link ZExecution.abort} method is called.
 *
 * Rejecting with this error as a reason is not considered an execution failure.
 */
export class AbortedZExecutionError extends Error {

  /**
   * Constructs aborted execution error.
   *
   * @param abortReason - A reason of abort.
   * @param message - Error message.
   */
  constructor(
      readonly abortReason?: any,
      message = 'Execution aborted',
  ) {
    super(abortReason !== undefined ? `${message}. ${abortReason}` : message);
  }

  get name(): string {
    return 'Aborted';
  }

}
