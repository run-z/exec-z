import { asis } from '@proc7ts/primitives';
import { AbortedZExecutionError } from './aborted-execution-error';
import { execZ } from './exec';
import { execZAfter } from './exec-after';
import type { ZExecution } from './execution';

describe('execZAfter', () => {

  let first: ZExecution<string>;
  let done1: (value: string) => void;
  let reject1: (error: any) => void;
  let abort1: jest.Mock;

  beforeEach(() => {
    abort1 = jest.fn();
    first = execZ(() => ({
      whenDone: () => new Promise((resolve, reject) => {
        done1 = resolve;
        reject1 = reject;
      }),
      abort: abort1,
    }));
  });

  let done2: () => void;
  let reject2: (error: any) => void;
  let abort2: jest.Mock;

  let exec: ZExecution<number>;
  let success: boolean;
  let error: any;

  beforeEach(() => {
    success = false;
    error = undefined;

    done2 = undefined!;
    reject2 = undefined!;
    abort2 = jest.fn();
    exec = execZAfter(
        first,
        firstResult => ({
          whenDone() {
            return new Promise<number>((resolve, reject) => {
              done2 = () => resolve(firstResult.length);
              reject2 = reject;
            });
          },
          abort: abort2,
        }),
    );

    exec.whenDone().then(() => success = true, e => error = e);
  });

  describe('whenDone', () => {
    it('succeeds when both executions succeed', async () => {
      done1('test');
      await exec.whenStarted();
      expect(success).toBe(false);

      done2();
      expect(await exec.whenDone()).toBe(4);
      expect(success).toBe(true);
    });
    it('fails when first execution failed', async () => {

      const reason = new Error('test');

      reject1(reason);

      expect(await exec.whenDone().catch(asis)).toBe(reason);
      expect(error).toBe(reason);
    });
    it('fails when second execution failed', async () => {

      const reason = new Error('test');

      done1('test');
      await exec.whenStarted();
      reject2(reason);

      expect(await exec.whenDone().catch(asis)).toBe(reason);
      expect(error).toBe(reason);
    });
  });

  describe('abort', () => {
    it('aborts only first execution before the second constructed', async () => {
      exec.abort();
      done1('test');
      expect(await exec.whenDone().catch(asis)).toBeInstanceOf(AbortedZExecutionError);

      expect(abort1).toHaveBeenCalledTimes(1);
      expect(abort2).not.toHaveBeenCalled();
      expect(success).toBe(false);
    });
    it('aborts only second execution after it is started', async () => {
      done1('test');
      await exec.whenStarted();
      exec.abort();
      done2();
      expect(await exec.whenDone()).toBe(4);

      expect(abort1).not.toHaveBeenCalled();
      expect(abort2).toHaveBeenCalledTimes(1);
      expect(success).toBe(true);
    });
  });
});
