import { describe, expect, it } from '@jest/globals';
import { asis, noop } from '@proc7ts/primitives';
import { failZ } from './fail.js';
import { immediateResolution } from './spec/immediate-resolution.js';

describe('failZ', () => {
  describe('whenStarted', () => {
    it('resolves immediately', async () => {
      const reason = new Error('test');
      const exec = failZ(reason);

      expect(await immediateResolution(exec.whenStarted())).toEqual([undefined]);
      expect(await exec.whenDone().catch(asis)).toBe(reason);
    });
  });
  describe('whenDone', () => {
    it('rejects immediately', async () => {
      const reason = new Error('test');

      expect(await immediateResolution(failZ(reason).whenDone())).toEqual([undefined, reason]);
    });
  });
  describe('abort', () => {
    it('is noop', async () => {
      const exec = failZ('test');

      expect(exec.abort).toBe(noop);

      // Await for promise rejection
      expect(await immediateResolution(exec.whenDone())).toEqual([undefined, 'test']);
    });
  });
});
