import { FailedZExecutionError } from './failed-execution-error';

describe('FailedZExecutionError', () => {
  describe('toString', () => {
    it('contains failure', () => {
      expect(new FailedZExecutionError('reason').toString()).toBe('Failed: reason');
    });
    it('contains explicit error message', () => {
      expect(new FailedZExecutionError('reason', 'It is failed').toString()).toBe('Failed: It is failed');
    });
    it('contains default error message', () => {
      expect(new FailedZExecutionError().toString()).toBe('Failed: Execution failed');
    });
  });
});
