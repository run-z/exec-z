import { describe, expect, it } from '@jest/globals';
import { AbortedZExecutionError } from './aborted-execution-error';

describe('AbortedZExecutionError', () => {
  describe('toString', () => {
    it('contains error message', () => {
      expect(String(new AbortedZExecutionError('reason'))).toBe(
        'Aborted: Execution aborted. reason',
      );
    });
    it('contains explicit error message', () => {
      expect(String(new AbortedZExecutionError('reason', 'It is aborted'))).toBe(
        'Aborted: It is aborted. reason',
      );
    });
    it('contains default error message', () => {
      expect(String(new AbortedZExecutionError())).toBe('Aborted: Execution aborted');
    });
  });
});
