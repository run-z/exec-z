import { describe, expect, it } from '@jest/globals';
import { noop } from '@proc7ts/primitives';
import { execZNoOp } from './exec-noop.js';
import { immediateResolution } from './spec/immediate-resolution.js';

describe('execZNoOp', () => {
  describe('whenStarted', () => {
    it('resolves immediately', async () => {
      expect(await immediateResolution(execZNoOp().whenStarted())).toEqual([undefined]);
    });
  });
  describe('whenDone', () => {
    it('resolves immediately', async () => {
      expect(await immediateResolution(execZNoOp().whenDone())).toEqual([undefined]);
    });
  });
  describe('abort', () => {
    it('is noop', () => {
      expect(execZNoOp().abort).toBe(noop);
    });
  });
});
