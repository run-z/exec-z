import { asis } from '@proc7ts/primitives';
import type { ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { AbortedZExecutionError } from './aborted-execution-error';
import { spawnZ } from './spawn';

describe('spawnZ', () => {

  let childProcess: jest.Mocked<ChildProcess>;
  let events: EventEmitter;

  beforeEach(() => {
    events = new EventEmitter();
    childProcess = {
      on: jest.fn((event, listener) => events.on(event, listener)),
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

    expect(await exec.whenDone().catch(asis)).toBe(13);
  });
  it('fails when process terminates by signal', async () => {

    const exec = spawnZ(() => childProcess);

    await exec.whenStarted();
    events.emit('exit', null, 'SIGKILL');

    const error = await exec.whenDone().catch(asis);

    expect(error).toBeInstanceOf(AbortedZExecutionError);
    expect(error.abortReason).toBe('SIGKILL');
  });
  it('fails when process terminates by large exit code', async () => {

    const exec = spawnZ(() => childProcess);

    await exec.whenStarted();
    events.emit('exit', 137);

    const error = await exec.whenDone().catch(asis);

    expect(error).toBeInstanceOf(AbortedZExecutionError);
    expect(error.abortReason).toBe(137);
  });
  it('kills the process on abort', async () => {

    const exec = spawnZ(() => childProcess);

    await exec.whenStarted();
    exec.abort();

    const error = await exec.whenDone().catch(asis);

    expect(error).toBeInstanceOf(AbortedZExecutionError);
    expect(error.abortReason).toBe('SIGTERM');
  });
  it('kills the process with custom signal on abort', async () => {

    const exec = spawnZ(() => childProcess, { kill: 'SIGKILL' });

    await exec.whenStarted();
    exec.abort();

    const error = await exec.whenDone().catch(asis);

    expect(error).toBeInstanceOf(AbortedZExecutionError);
    expect(error.abortReason).toBe('SIGKILL');
  });
  it('kills the process by custom method on abort', async () => {

    const kill = jest.fn(() => { events.emit('exit', null, 'SIGUSR1'); });
    const exec = spawnZ(() => childProcess, { kill });

    await exec.whenStarted();
    exec.abort();

    const error = await exec.whenDone().catch(asis);

    expect(error).toBeInstanceOf(AbortedZExecutionError);
    expect(error.abortReason).toBe('SIGUSR1');
    expect(kill).toHaveBeenCalledWith(childProcess);
  });
  it('does not start the process on immediate abort', async () => {

    const spawn = jest.fn();
    const exec = spawnZ(spawn);

    exec.abort();
    expect(await exec.whenStarted().catch(asis)).toBeInstanceOf(AbortedZExecutionError);
    expect(await exec.whenDone().catch(asis)).toBeInstanceOf(AbortedZExecutionError);
    expect(spawn).not.toHaveBeenCalled();
  });
});
