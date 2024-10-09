import { lazyValue, noop } from '@proc7ts/primitives';
import type { Worker } from 'node:worker_threads';
import { AbortedZExecutionError } from './aborted-execution-error.js';
import { execZ } from './exec.js';
import type { ZExecution } from './execution.js';

/**
 * Spawned worker thread configuration.
 */
export interface SpawnZWorkerConfig {
  /**
   * Stops worker thread.
   *
   * @param worker - The worker to stop.
   *
   * @default Invokes `Worker.terminate()`
   */
  stop?(worker: Worker): void;
}

/**
 * Spawns worker thread.
 *
 * @param spawn - Starter function returning started worker instance.
 * @param config - Spawned worker thread configuration.
 *
 * @returns New worker thread execution instance stopping the thread on abort.
 */
export function spawnZWorker(
  spawn: (this: void) => Worker,
  config: SpawnZWorkerConfig = {},
): ZExecution {
  const { stop } = config;
  const stopWorker = stop ? stop.bind(config) : (worker: Worker) => worker.terminate();

  return execZ(() => {
    let abort: () => void;
    let start: () => void;
    let dontStart: (error: unknown) => void;

    const whenStarted = new Promise<void>((resolve, reject) => {
      start = resolve;
      dontStart = reject;
    });

    let whenDone = (): Promise<void> =>
      new Promise<void>((resolve, reject) => {
        const worker = spawn();

        abort = (): void => {
          stopWorker(worker);
        };

        const reportError = (error: Error): void => {
          abort = noop;
          dontStart(error);
          reject(error);
        };

        worker.on('online', start);
        worker.on('error', reportError);
        worker.on('exit', code => {
          if (code) {
            reportError(new AbortedZExecutionError(code));
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
      whenStarted() {
        return whenStarted;
      },
      whenDone() {
        return whenDone();
      },
      abort() {
        abort();
      },
    };
  });
}
