import { noop } from '@proc7ts/primitives';
import { resolveZ } from './resolve';
import { immediateResolution } from './spec';

describe('resolveZ', () => {
  describe('whenStarted', () => {
    it('resolves immediately', async () => {
      expect(await immediateResolution(resolveZ('test').whenStarted())).toEqual([undefined]);
    });
  });
  describe('whenDone', () => {
    it('resolves immediately', async () => {
      expect(await immediateResolution(resolveZ('test').whenDone())).toEqual(['test']);
    });
  });
  describe('abort', () => {
    it('is noop', () => {
      expect(resolveZ('test').abort).toBe(noop);
    });
  });
});
