import { describe, expect, it } from '@jest/globals';
import { FailedZExecutionError } from './failed-execution-error';

describe('FailedZExecutionError', () => {
  describe('toString', () => {
    it('contains failure', () => {
      expect(String(new FailedZExecutionError('reason'))).toBe('Failed: Execution failed. reason');
    });
    it('contains explicit error message', () => {
      expect(String(new FailedZExecutionError('reason', 'It is failed'))).toBe(
        'Failed: It is failed. reason',
      );
    });
    it('contains default error message', () => {
      expect(String(new FailedZExecutionError())).toBe('Failed: Execution failed');
    });
  });
});
