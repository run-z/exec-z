import { AbortedZExecutionError } from './aborted-execution-error';

describe('AbortedZExecutionError', () => {
  describe('toString', () => {
    it('contains error message', () => {
      expect(new AbortedZExecutionError('reason').toString()).toBe('Aborted: reason');
    });
  });
});
