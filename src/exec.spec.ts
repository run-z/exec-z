import { asis, noop } from '@proc7ts/primitives';
import { AbortedZExecutionError } from './aborted-execution-error';
import type { DelayedZExecution } from './delayed-execution';
import { execZ } from './exec';
import type { ZExecution } from './execution';

describe('execZ', () => {
  describe('whenStarted', () => {
    it('is called on start', async () => {

      let done!: () => void;
      const whenDone = new Promise<void>(resolve => {
        done = resolve;
      });

      const started = new Promise<DelayedZExecution>(resolve => {

        const exec = execZ(async () => {
          await Promise.resolve();
          resolve(exec);
          return ({
            whenDone() {
              return whenDone;
            },
            abort: noop,
          });
        });

      });

      const exec = await started;

      expect(await exec.whenStarted()).toBeUndefined();

      done();
      await exec.whenDone();
    });
    it('is called after start', async () => {

      let done!: () => void;
      const whenDone = new Promise<void>(resolve => {
        done = resolve;
      });

      const started = new Promise<DelayedZExecution>(resolve => {

        const exec = execZ(async () => {
          await Promise.resolve();
          resolve(exec);
          return ({
            whenDone() {
              return whenDone;
            },
            abort: noop,
          });
        });

      });

      const exec = await started;

      done();
      await exec.whenDone();
      expect(await exec.whenStarted()).toBeUndefined();
    });
    it('is called on startup failure', async () => {

      const error = new Error('test');
      const exec = execZ(async () => {
        await Promise.resolve();
        throw error;
      });

      expect(await exec.whenStarted().catch(asis)).toBe(error);
      expect(await exec.whenDone().catch(asis)).toBe(error);
    });
    it('is called after startup failed', async () => {

      const error = new Error('test');
      const exec = execZ(async () => {
        await Promise.resolve();
        throw error;
      });

      expect(await exec.whenDone().catch(asis)).toBe(error);
      expect(await exec.whenStarted().catch(asis)).toBe(error);
    });
    it('is called on abort', async () => {

      const exec = execZ(async () => {
        await Promise.resolve();
        return {
          whenDone() {
            return Promise.resolve();
          },
          abort: noop,
        };
      });

      const whenStarted = exec.whenStarted();

      exec.abort();
      expect(await whenStarted.catch(asis)).toBeInstanceOf(AbortedZExecutionError);
    });
    it('is called after abort', async () => {

      const exec = execZ(async () => {
        await Promise.resolve();
        return {
          whenDone() {
            return Promise.resolve();
          },
          abort: noop,
        };
      });

      exec.abort();
      expect(await exec.whenStarted().catch(asis)).toBeInstanceOf(AbortedZExecutionError);
    });
  });

  describe('abort', () => {

    let abort: jest.Mock<any, any>;
    let exec: ZExecution;

    beforeEach(() => {
      abort = jest.fn();
    });

    afterEach(async () => {
      await exec.whenDone().catch(noop);
    });

    it('is called immediately at most once', async () => {
      exec = execZ(() => ({
        whenDone() {
          return Promise.resolve();
        },
        abort,
      }));

      exec.abort();
      exec.abort();
      exec.abort();

      await exec.whenDone().catch(noop);

      expect(abort).toHaveBeenCalledTimes(1);
    });
    it('is called at most once after initialization', async () => {

      let done!: () => void;
      exec = execZ(() => ({
        whenDone() {
          return new Promise(resolve => done = resolve);
        },
        abort,
      }));

      await Promise.resolve();
      await Promise.resolve();
      done();

      exec.abort();
      exec.abort();
      exec.abort();

      await exec.whenDone().catch(noop);

      expect(abort).toHaveBeenCalledTimes(1);
    });
  });
});
