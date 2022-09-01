import { beforeEach, describe, expect, it } from '@jest/globals';
import { asis } from '@proc7ts/primitives';
import { Worker } from 'node:worker_threads';
import { AbortedZExecutionError } from './aborted-execution-error';
import type { ZExecution } from './execution';
import { spawnZWorker, SpawnZWorkerConfig } from './spawn-worker';

describe('spawnZWorker', () => {
  let out: string;

  beforeEach(() => {
    out = '';
  });

  it('starts the worker', async () => {
    await start().whenDone();
    expect(out).toContain('WORKER');
  });
  it('is terminated on abort', async () => {
    const exec = start('stale.mjs');

    await exec.whenStarted();
    exec.abort();

    expect(await exec.whenDone().catch(asis)).toEqual(new AbortedZExecutionError(1));
  });
  it('is not started when aborted immediately', async () => {
    const exec = start('stale.mjs');

    exec.abort();

    expect(await exec.whenDone().catch(asis)).toEqual(new AbortedZExecutionError());
    expect(out).toBe('');
  });
  it('is stopped by custom method', async () => {
    const exec = start('stale.mjs', { stop: worker => worker.postMessage({ stop: 0 }) });

    await exec.whenStarted();
    exec.abort();

    expect(await exec.whenDone()).toBeUndefined();
  });
  it('is aborted by custom method', async () => {
    const exec = start('stale.mjs', { stop: worker => worker.postMessage({ stop: 1 }) });

    await exec.whenStarted();
    exec.abort();

    expect(await exec.whenDone().catch(asis)).toEqual(new AbortedZExecutionError(1));
  });
  it('is failed on thread execution error', async () => {
    const exec = start('fail.mjs');

    await exec.whenStarted();

    const error = await exec.whenDone().catch(asis);

    expect(error.constructor.name).toBe('TypeError');
    expect(error.message).toBe('FAILED');
    expect(out).toContain('FAIL');
  });

  function start(script = 'ok.mjs', config?: SpawnZWorkerConfig): ZExecution {
    return spawnZWorker(() => {
      const worker = new Worker(`./src/spec/${script}`, {
        stderr: true,
        stdout: true,
      });

      worker.stdout.on('data', chunk => (out += String(chunk)));

      return worker;
    }, config);
  }
});
