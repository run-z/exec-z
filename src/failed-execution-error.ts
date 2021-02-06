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
      readonly failure?: any,
      message = String(failure ?? 'Execution failed'),
  ) {
    super(message);
  }

  toString(): string {
    return `Failed: ${this.message}`;
  }

}
