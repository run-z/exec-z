import { asis, noop } from '@proc7ts/primitives';
import { execZ } from './exec';
import { execZAll } from './exec-all';
import type { ZExecution } from './execution';

describe('execZAll', () => {

  let done1: (value: string) => void;
  let reject1: (error: any) => void;
  let whenDone1: Promise<string>;
  let exec1: ZExecution<string>;
  let isDone1: boolean;
  let abort1: jest.Mock;

  let done2: (value: string) => void;
  let whenDone2: Promise<string>;
  let exec2: ZExecution<string>;
  let isDone2: boolean;
  let abort2: jest.Mock;

  beforeEach(() => {
    whenDone1 = new Promise((resolve, reject) => {
      done1 = resolve;
      reject1 = reject;
    });
    abort1 = jest.fn();
    exec1 = execZ(() => ({
      whenDone() {
        return whenDone1;
      },
      abort: abort1,
    }));

    whenDone2 = new Promise(resolve => {
      done2 = resolve;
    });
    abort2 = jest.fn();
    exec2 = execZ(() => ({
      whenDone() {
        return whenDone2;
      },
      abort: abort2,
    }));

    isDone1 = false;
    isDone2 = false;

    exec1.whenDone().then(() => isDone1 = true, noop);
    exec2.whenDone().then(() => isDone2 = true, noop);
  });

  let all: ZExecution<[string, string]>;

  beforeEach(() => {
    all = execZAll([exec1, exec2]);
  });

  it('starts when all executions do', async () => {
    await all.whenStarted();
    expect(isDone1).toBe(false);
    expect(isDone2).toBe(false);

    done1('1');
    done2('2');
    expect(await all.whenDone()).toEqual(['1', '2']);
    expect(isDone1).toBe(true);
    expect(isDone2).toBe(true);
  });
  it('succeeds when all executions do', async () => {

    const promise = all.whenDone();

    done1('1');
    done2('2');
    expect(await promise).toEqual(['1', '2']);
    expect(isDone1).toBe(true);
    expect(isDone2).toBe(true);
  });
  it('fails when one of the executions fail', async () => {

    const promise = all.whenDone();
    const error = new Error('test');

    reject1(error);
    expect(await promise.catch(asis)).toBe(error);
    expect(isDone1).toBe(false);
    expect(isDone2).toBe(false);
  });
  it('aborts other executions when one of them fail', async () => {

    const promise = all.whenDone();
    const error = new Error('test');

    reject1(error);
    expect(await promise.catch(asis)).toBe(error);
    expect(abort1).not.toHaveBeenCalled();
    expect(abort2).toHaveBeenCalledTimes(1);
  });

  describe('abort', () => {
    it('aborts all executions', async () => {

      const promise = all.whenDone();

      all.abort();
      done1('1');
      done2('2');
      expect(await promise).toEqual(['1', '2']);

      expect(abort1).toHaveBeenCalledTimes(1);
      expect(abort2).toHaveBeenCalledTimes(1);
    });
  });

  describe('without executions', () => {
    it('succeeds', async () => {
      expect(await execZAll([]).whenDone()).toHaveLength(0);
    });
  });
});
