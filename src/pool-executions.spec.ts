import { beforeEach, describe, expect, it } from '@jest/globals';
import { asis } from '@proc7ts/primitives';
import { AbortedZExecutionError } from './aborted-execution-error.js';
import { execZ, ZExecutionStarter } from './exec.js';
import { poolZExecutions } from './pool-executions.js';

describe('poolZExecutions', () => {
  let started: Set<number>;
  let finished: Map<number, any>;
  let aborted: Set<number>;

  beforeEach(() => {
    started = new Set();
    finished = new Map();
    aborted = new Set();
  });

  it('executes immediately when `maxRunning` is zero or negative', () => {
    expect(poolZExecutions(0)).toBe(execZ);
    expect(poolZExecutions(-1)).toBe(execZ);
  });
  it('executes immediately when pool limit allows', async () => {
    const pool = poolZExecutions(2);

    const [start1, end1] = testJob(1);
    const exec1 = pool(start1);

    const [start2, end2] = testJob(2);
    const exec2 = pool(start2);

    await exec1.whenStarted();
    await exec2.whenStarted();

    expect(started.size).toBe(2);
    expect(aborted.size).toBe(0);
    expect(finished.size).toBe(0);

    end2();
    await exec2.whenDone();

    expect(aborted.size).toBe(0);
    expect(finished.has(1)).toBe(false);
    expect(finished.get(2)).toBeNull();

    end1();
    await exec1.whenDone();

    expect(aborted.size).toBe(0);
    expect(finished.get(1)).toBeNull();
    expect(finished.get(2)).toBeNull();
  });
  it('delays execution until pool limit allows', async () => {
    const pool = poolZExecutions(1);

    const [start1, end1] = testJob(1);
    const exec1 = pool(start1);

    const [start2, end2] = testJob(2);
    const exec2 = pool(start2);

    await exec1.whenStarted();

    expect(started.size).toBe(1);
    expect(aborted.size).toBe(0);
    expect(finished.size).toBe(0);

    end1();
    await exec1.whenDone();
    await exec2.whenStarted();

    expect(started.size).toBe(2);
    expect(aborted.size).toBe(0);
    expect(finished.get(1)).toBeNull();
    expect(finished.has(2)).toBe(false);

    end2();
    await exec2.whenDone();

    expect(aborted.size).toBe(0);
    expect(finished.get(1)).toBeNull();
    expect(finished.get(2)).toBeNull();
  });
  it('returns execution slot to pool after error', async () => {
    const pool = poolZExecutions(1);

    const [start1, end1] = testJob(1);
    const exec1 = pool(start1);

    await exec1.whenStarted();

    expect(started.size).toBe(1);
    expect(aborted.size).toBe(0);
    expect(finished.size).toBe(0);

    const error = new Error('test');

    end1(error);
    expect(await exec1.whenDone().catch(asis)).toBe(error);
    expect(finished.get(1)).toBe(error);

    const [start2, end2] = testJob(2);
    const exec2 = pool(start2);

    await exec2.whenStarted();

    expect(started.size).toBe(2);
    expect(aborted.size).toBe(0);
    expect(finished.has(2)).toBe(false);

    end2();
    await exec2.whenDone();

    expect(aborted.size).toBe(0);
    expect(finished.get(1)).toBe(error);
    expect(finished.get(2)).toBeNull();
  });
  it('does not start already aborted execution', async () => {
    const pool = poolZExecutions();

    const [start1] = testJob(1);
    const exec1 = pool(start1);

    const [start2, end2] = testJob(2);
    const exec2 = pool(start2);

    exec1.abort();
    await exec2.whenStarted();

    expect(started.has(1)).toBe(false);
    expect(started.has(2)).toBe(true);
    expect(aborted.has(1)).toBe(false);
    expect(aborted.has(2)).toBe(false);

    end2();
    expect(await exec1.whenStarted().catch(asis)).toEqual(new AbortedZExecutionError());
    expect(await exec1.whenDone().catch(asis)).toEqual(new AbortedZExecutionError());
    await exec2.whenDone();
    expect(finished.has(1)).toBe(false);
    expect(finished.get(2)).toBeNull();
  });
  it('reports failed to start execution', async () => {
    const pool = poolZExecutions();
    const error = new Error('test');
    const [start1] = testJob(1, () => Promise.reject(error));
    const exec1 = pool(start1);

    const [start2, end2] = testJob(2);
    const exec2 = pool(start2);

    await exec2.whenStarted();
    expect(await exec1.whenStarted().catch(asis)).toBe(error);

    expect(started.has(1)).toBe(true);
    expect(started.has(2)).toBe(true);
    expect(aborted.has(1)).toBe(false);
    expect(aborted.has(2)).toBe(false);

    end2();
    await exec2.whenDone();
    expect(finished.has(1)).toBe(false);
    expect(finished.get(2)).toBeNull();
  });
  it('returns execution aborted before started to the pool', async () => {
    const pool = poolZExecutions(1);

    const [start1] = testJob(1);
    const exec1 = pool(start1);

    const [start2, end2] = testJob(2);
    const exec2 = pool(start2);

    exec1.abort();
    expect(await exec1.whenStarted().catch(asis)).toEqual(new AbortedZExecutionError());
    await exec2.whenStarted();

    expect(started.has(1)).toBe(false);
    expect(started.has(2)).toBe(true);
    expect(aborted.has(1)).toBe(false);
    expect(aborted.has(2)).toBe(false);

    end2();
    expect(await exec1.whenDone().catch(asis)).toEqual(new AbortedZExecutionError());
    await exec2.whenDone();
    expect(finished.has(1)).toBe(false);
    expect(finished.get(2)).toBeNull();
  });
  it('aborts started execution', async () => {
    const pool = poolZExecutions(1);

    const [start1] = testJob(1);
    const exec1 = pool(start1);

    const [start2, end2] = testJob(2);
    const exec2 = pool(start2);

    await exec1.whenStarted();
    exec1.abort();
    await exec2.whenStarted();

    expect(started.has(1)).toBe(true);
    expect(started.has(2)).toBe(true);
    expect(aborted.has(1)).toBe(true);
    expect(aborted.has(2)).toBe(false);

    end2();
    expect(await exec1.whenDone().catch(asis)).toEqual(new AbortedZExecutionError(1));
    await exec2.whenDone();
    expect(finished.get(1)).toEqual(new AbortedZExecutionError(1));
    expect(finished.get(2)).toBeNull();
  });

  function testJob(
    id: number,
    whenStarted: () => Promise<void> = () => Promise.resolve(),
  ): [start: ZExecutionStarter, end: (error?: unknown) => void] {
    let end!: (error?: unknown) => void;
    const whenEnd = new Promise<void>((resolve, reject) => {
      end = error => {
        if (error != null) {
          reject(error);
        } else {
          resolve();
        }
      };
    });
    const start: ZExecutionStarter = () => {
      started.add(id);

      return {
        whenStarted,
        whenDone() {
          return whenEnd.then(
            () => {
              finished.set(id, null);
            },
            error => {
              finished.set(id, error);

              return Promise.reject(error);
            },
          );
        },
        abort() {
          aborted.add(id);
          end(new AbortedZExecutionError(id));
        },
      };
    };

    return [start, end];
  }
});
