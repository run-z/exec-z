import worker_threads from 'worker_threads';

worker_threads.parentPort.on('message', ({ stop }) => {
  if (stop != null) {
    process.exit(stop);
  }
});

// Prevent worker from stopping
const id = setInterval(
    () => {
      clearInterval(id);
    },
    5000,
);
