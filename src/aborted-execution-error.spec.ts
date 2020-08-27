import { AbortedZExecutionError } from './aborted-execution-error';

describe('AbortedZExecutionError', () => {
  describe('toString', () => {
    it('contains error message', () => {
      expect(new AbortedZExecutionError('reason').toString()).toBe('Aborted: reason');
    });
    it('contains explicit error message', () => {
      expect(new AbortedZExecutionError('reason', 'It is aborted').toString()).toBe('Aborted: It is aborted');
    });
    it('contains default error message', () => {
      expect(new AbortedZExecutionError().toString()).toBe('Aborted: Execution aborted');
    });
  });
});
