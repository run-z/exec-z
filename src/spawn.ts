import { lazyValue, noop } from '@proc7ts/primitives';
import type { ChildProcess } from 'node:child_process';
import { AbortedZExecutionError } from './aborted-execution-error.js';
import { execZ } from './exec.js';
import type { ZExecution } from './execution.js';
import { FailedZExecutionError } from './failed-execution-error.js';

/**
 * Spawned process configuration.
 */
export interface SpawnZConfig {
  /**
   * A signal to send to spawned process on abort execution, or a function to call to kill it.
   *
   * @default `SIGTERM`
   */
  readonly kill?:
    | NodeJS.Signals
    | number
    | ((this: this, process: ChildProcess) => void)
    | undefined;
}

/**
 * Spawns child process.
 *
 * @param spawn - Starter function returning started child process instance.
 * @param config - Spawned process configuration.
 *
 * @returns New process execution instance killing the process on abort.
 */
export function spawnZ(spawn: (this: void) => ChildProcess, config: SpawnZConfig = {}): ZExecution {
  const { kill } = config;
  const killProcess =
    typeof kill === 'function' ? kill.bind(config) : (process: ChildProcess) => process.kill(kill);

  return execZ<void>(() => {
    let abort: () => void;
    let whenDone = (): Promise<void> =>
      new Promise<void>((resolve, reject) => {
        const childProcess = spawn();

        abort = (): void => {
          killProcess(childProcess);
        };

        const reportError = (error: Error): void => {
          abort = noop;
          reject(error);
        };

        childProcess.on('error', reportError);
        childProcess.on('exit', (code, signal) => {
          if (signal) {
            reportError(new AbortedZExecutionError(signal));
          } else if (code) {
            reportError(
              code > 127 ? new AbortedZExecutionError(code) : new FailedZExecutionError(code),
            );
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
