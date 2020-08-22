import { noop } from '@proc7ts/primitives';
import { failZ } from './fail';
import { immediateResolution } from './spec';

describe('failZ', () => {
  describe('whenDone', () => {
    it('rejects immediately', async () => {

      const reason = new Error('test');

      expect(await immediateResolution(failZ(reason).whenDone())).toEqual([undefined, reason]);
    });
  });
  describe('abort', () => {
    it('is noop', async () => {

      const process = failZ('test');

      expect(process.abort).toBe(noop);

      // Await for promise rejection
      expect(await immediateResolution(process.whenDone())).toEqual([undefined, 'test']);
    });
  });
});
