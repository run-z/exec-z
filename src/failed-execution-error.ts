/**
 * Error raised when execution failed.
 */
export class FailedZExecutionError extends Error {

  /**
   * Constructs aborted execution error.
   *
   * @param failure - Execution failure.
   * @param message - Error message.
   */
  constructor(
      readonly failure?: unknown,
      message = 'Execution failed',
  ) {
    super(failure !== undefined ? `${message}. ${failure}` : message);
  }

  get name(): string {
    return 'Failed';
  }

}
