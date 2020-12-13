// https://youtu.be/u1kqx6AenYw?t=835
// Documentation https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model
while (true) {
  // Could have multiple task queues
  let taskQueue = eventLoop.getNextQueue();

  // Only do one task!
  let oldestTask = taskQueue.pop();
  eventLoop.setCurrentlyRunningTask(oldestTask);
  let taskStartTime = window.performance.now();
  eventLoop.execute(oldestTask);
  eventLoop.setCurrentlyRunningTask(null);

  // Until microtask queue is empty, even if microtasks are added while this is running
  // https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint
  while (microtaskQueue.hasTasks()) {
    doMicroTask();
  }
  let hasARenderingOpportunity = false;
  let now = window.performance.now();
  eventLoop.reportTaskDuration();

  if (isRepaintTime()) {
    // Typically: 60 frames per second, or a frame every 16 milliseconds but could be slower if the hardware does not support this speed
    // Tasks are added via: requestAnimationFrame(callback)
    eventLoop.prepareRepaint();

    // https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#run-the-animation-frame-callbacks
    // Get the queue now, so no other tasks added while running are executed...
    // ... but run all the ones that are currently in the queue.
    let callbacks = eventLoop.mapAnimationFrameCallbacks;
    let callbackHandles = callbacks.keys();
    for (handle in callbackHandles) {
      let callback = callbacks.get(handle);
      callbacks.delete(handle);
      callback(now);
    }
    repaint();
  }
}

// What is the current high resolution time?
function timer(remaining) {
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      console.log(`${remaining}-${i}: `, new Date().toJSON(), window.performance.now());
    }
    if (remaining > 0) {
      timer(remaining - 1);
    }
  }, 1000);
}

console.log(new Date().toJSON());
console.log(window.performance.now());
timer(9);

// For slide...

while (true) {
  // Could have multiple task queues
  let taskQueue = getNextQueue();

  // Only do one task!
  execute(taskQueue.pop());

  // Until microtask queue is empty, even if microtasks are added while this loop is running
  while (microtaskQueue.hasTasks()) {
    execute(microtaskQueue.pop());
  }

  if (isRepaintTime()) {
    // Resize, scroll, media queries, animations, ...
    prepareRepaint();

    // Get the queue now. No other tasks added while running are executed
    let callbacks = getAnimationFrameCallbacks();
    for (callback in callbacks) {
      execute(callback);
    }

    repaint();
  }
}

// Typically: 60 frames per second, or a frame every 16 milliseconds but could be slower if the hardware does not support this speed
// Tasks are added via: requestAnimationFrame(callback)
