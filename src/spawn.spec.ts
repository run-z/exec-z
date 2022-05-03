import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { asis } from '@proc7ts/primitives';
import type { ChildProcess } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { AbortedZExecutionError } from './aborted-execution-error';
import { FailedZExecutionError } from './failed-execution-error';
import { spawnZ } from './spawn';

describe('spawnZ', () => {

  let childProcess: ChildProcess;
  let events: EventEmitter;

  beforeEach(() => {
    events = new EventEmitter();
    childProcess = {
      on: jest.fn((event: string, listener: (...args: any[]) => void) => events.on(event, listener)),
      kill: jest.fn((signal = 'SIGTERM') => {
        events.emit('exit', undefined, signal);
      }),
    } as any;
  });

  it('succeeds when process exits with zero code', async () => {

    const exec = spawnZ(() => childProcess);

    await exec.whenStarted();
    events.emit('exit', 0);

    expect(await exec.whenDone()).toBeUndefined();
  });
  it('fails when process exits with non-zero code', async () => {

    const exec = spawnZ(() => childProcess);

    await exec.whenStarted();
    events.emit('exit', 13);

    expect(await exec.whenDone().catch(asis)).toEqual(new FailedZExecutionError(13));
  });
  it('fails when process terminates by signal', async () => {

    const exec = spawnZ(() => childProcess);

    await exec.whenStarted();
    events.emit('exit', null, 'SIGKILL');

    expect(await exec.whenDone().catch(asis)).toEqual(new AbortedZExecutionError('SIGKILL'));
  });
  it('fails when process terminates by large exit code', async () => {

    const exec = spawnZ(() => childProcess);

    await exec.whenStarted();
    events.emit('exit', 137);

    expect(await exec.whenDone().catch(asis)).toEqual(new AbortedZExecutionError(137));
  });
  it('kills the process on abort', async () => {

    const exec = spawnZ(() => childProcess);

    await exec.whenStarted();
    exec.abort();

    expect(await exec.whenDone().catch(asis)).toEqual(new AbortedZExecutionError('SIGTERM'));
  });
  it('kills the process with custom signal on abort', async () => {

    const exec = spawnZ(() => childProcess, { kill: 'SIGKILL' });

    await exec.whenStarted();
    exec.abort();

    expect(await exec.whenDone().catch(asis)).toEqual(new AbortedZExecutionError('SIGKILL'));
  });
  it('kills the process by custom method on abort', async () => {

    const kill = jest.fn((_proc: ChildProcess) => { events.emit('exit', null, 'SIGUSR1'); });
    const exec = spawnZ(() => childProcess, { kill });

    await exec.whenStarted();
    exec.abort();

    expect(await exec.whenDone().catch(asis)).toEqual(new AbortedZExecutionError('SIGUSR1'));
    expect(kill).toHaveBeenCalledWith(childProcess);
  });
  it('does not start the process on immediate abort', async () => {

    const spawn = jest.fn<() => ChildProcess>();
    const exec = spawnZ(spawn);

    exec.abort();
    expect(await exec.whenStarted().catch(asis)).toEqual(new AbortedZExecutionError());
    expect(await exec.whenDone().catch(asis)).toEqual(new AbortedZExecutionError());
    expect(spawn).not.toHaveBeenCalled();
  });
});
