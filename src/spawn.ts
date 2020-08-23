/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import { lazyValue, noop } from '@proc7ts/primitives';
import type { ChildProcess } from 'child_process';
import { AbortedZExecutionError } from './aborted-execution-error';
import { execZ } from './exec';
import type { ZExecution } from './execution';

/**
 * Spawned process configuration.
 */
export interface SpawnZConfig {

  /**
   * A signal to send to spawned process on abort.
   *
   * @default `SIGTERM`
   */
  readonly kill?: NodeJS.Signals | number;

}

/**
 * Spawns child process.
 *
 * @param spawn  Starter function returning started child process instance.
 * @param config  Spawned process configuration.
 *
 * @returns New process execution instance destroying killing the process on abort.
 */
export function spawnZ(
    spawn: (this: void) => ChildProcess,
    config: SpawnZConfig = {},
): ZExecution {
  return execZ<void>(() => {

    let abort: () => void;
    let whenDone = (): Promise<void> => new Promise<void>((resolve, reject) => {

      const childProcess = spawn();

      abort = (): void => {
        childProcess.kill(config.kill);
      };

      const reportError = (error: any): void => {
        abort = noop;
        reject(error);
      };

      childProcess.on('error', reportError);
      childProcess.on('exit', (code, signal) => {
        if (signal) {
          reportError(new AbortedZExecutionError(signal));
        } else if (code) {
          reportError(code > 127 ? new AbortedZExecutionError(code) : code);
        } else {
          abort = noop;
          resolve();
        }
      });
    });

    abort = (): void => {
      whenDone = lazyValue(() => Promise.reject(new AbortedZExecutionError()));
    };

    return {
      whenDone() {
        return whenDone();
      },
      abort() {
        abort();
      },
    };
  });
}
