import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { asis, noop } from '@proc7ts/primitives';
import type { Mock } from 'jest-mock';
import { AbortedZExecutionError } from './aborted-execution-error';
import { execZ } from './exec';
import type { ZExecution } from './execution';

describe('execZ', () => {
  describe('whenStarted', () => {
    it('is called on start', async () => {

      let done!: () => void;
      const whenDone = new Promise<void>(resolve => {
        done = resolve;
      });

      const started = new Promise<[ZExecution]>(resolve => {

        const exec = execZ<void>(async () => {
          await Promise.resolve();
          resolve([exec]);

          return ({
            whenDone() {
              return whenDone;
            },
          });
        });

      });

      const [exec] = await started;

      expect(await exec.whenStarted()).toBeUndefined();

      done();
      await exec.whenDone();
    });
    it('is called after start', async () => {

      let done!: () => void;
      const whenDone = new Promise<void>(resolve => {
        done = resolve;
      });

      const started = new Promise<[ZExecution]>(resolve => {

        const exec = execZ<void>(async () => {
          await Promise.resolve();
          resolve([exec]);

          return ({
            whenDone() {
              return whenDone;
            },
          });
        });

      });

      const [exec] = await started;

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
        };
      });

      const whenStarted = exec.whenStarted();

      exec.abort();
      expect(await whenStarted.catch(asis)).toEqual(new AbortedZExecutionError());
    });
    it('is called after abort', async () => {

      const exec = execZ(async () => {
        await Promise.resolve();

        return {
          whenDone() {
            return Promise.resolve();
          },
        };
      });

      exec.abort();
      expect(await exec.whenStarted().catch(asis)).toEqual(new AbortedZExecutionError());
    });
  });

  describe('abort', () => {

    let abort: Mock<() => void>;
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
    it('is called at most once when started', async () => {

      let done!: () => void;

      exec = execZ(() => ({
        whenDone() {
          return new Promise(resolve => done = resolve);
        },
        abort,
      }));

      await exec.whenStarted();
      done();

      exec.abort();
      exec.abort();
      exec.abort();

      await exec.whenDone().catch(noop);

      expect(abort).toHaveBeenCalledTimes(1);
    });
    it('is not aborted when started without abort method', async () => {

      let done!: () => void;

      exec = execZ(() => ({
        whenDone() {
          return new Promise(resolve => done = resolve);
        },
      }));

      await exec.whenStarted();
      done();

      exec.abort();
      exec.abort();
      exec.abort();

      expect(await exec.whenDone().catch(asis)).toBeUndefined();
    });
  });
});
