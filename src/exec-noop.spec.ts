import { noop } from '@proc7ts/primitives';
import { execZNoOp } from './exec-noop';
import { immediateResolution } from './spec';

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
  describe('then', () => {
    it('is resolved to `undefined`', async () => {
      expect(await execZNoOp()).toBeUndefined();
    });
  });
});
