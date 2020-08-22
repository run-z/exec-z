/**
 * @packageDocumentation
 * @module @run-z/exec-z
 */
import type { ZExecution } from './execution';

/**
 * An abortable execution which start can be delayed.
 */
export interface DelayedZExecution extends ZExecution {

  /**
   * Awaits for execution to start.
   *
   * @returns A promise resolved when execution started, or rejected when it is aborted before being started.
   */
  whenStarted(): Promise<void>;

}
