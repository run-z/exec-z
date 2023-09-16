import { describe, expect, it } from '@jest/globals';
import { noop } from '@proc7ts/primitives';
import { resolveZ } from './resolve.js';
import { immediateResolution } from './spec/immediate-resolution.js';

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
