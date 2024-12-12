---
title: "Debugging Unhandled Rejections in Jest"
description: "Track down what is causing unhandled exceptions in your Jest tests"
pubDate: 2022-04-16
tags: [devblog, jest, node, unhandled-exception]
image: "@assets/debugging-unhandled-rejections-in-jest/images/header.png"
---

![unhandled exceptions](@assets/debugging-unhandled-rejections-in-jest/images/header.png "Unhandled Exceptions")

I recently had to update a work project to build with Node 16, coming from Node 12. This was relatively painless and involved updating some dependencies. After the update, my application continued to operate as expected and I could find no issues. My thought was, "Great! That was easy!" Then I ran our test suites and started to see an error message pop up in the Jest output:

```shell
[UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "Oh no! An unhandled promise rejection!".] {
  code: 'ERR_UNHANDLED_REJECTION'
}
```

That wasn't the actual rejection reason, but you get the idea. Between Node 12 and Node 16 (in [Node 15](https://developer.ibm.com/blogs/nodejs-15-release-blog/), actually), unhandled rejections changed from being a warning to being an error. So all of those Jest warnings that I was seeing before that I was ignoring started causing problems. Though it would be more work to fix this, this wasn't a bad thing. I'm always up for sanding down some rough spots. But where do I need to fix the issue? Look at the full output of this mock test and see if you can figure that out:

```shell
 RUNS  unhandledRejection.test.js
node:internal/process/promises:279
            triggerUncaughtException(err, true /* fromPromise */);
            ^

[UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "Oh no! An unhandled promise rejection!".] {
  code: 'ERR_UNHANDLED_REJECTION'
}
```

Did you find the location in the code that's causing the problem? Neither could I. Thankfully, the [Node documentation](https://nodejs.org/api/process.html#process_event_unhandledrejection) comes to the rescue:

> The 'unhandledRejection' event is emitted whenever a Promise is rejected and no error handler is attached to the promise within a turn of the event loop. When programming with Promises, exceptions are encapsulated as "rejected promises". Rejections can be caught and handled using promise.catch() and are propagated through a Promise chain. The 'unhandledRejection' event is useful for detecting and keeping track of promises that were rejected whose rejections have not yet been handled.

Basically, Node will emit an event when a promise is rejected and not caught. When this happens in Jest, the error is shown but without much context. So how do we get the context (a stack trace would be great)? The documentation provides a handy helper function to do just that:

```javascript
import process from 'process';

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// Application specific logging, throwing an error, or other logic here
});
```

This is great, but I wasn't sure how to get it to run during a test. Putting it in the test file didn't work for me. There could be a solution using the test file, but I didn't find one. What I did find was the suggestion to utilize the Jest configuration to handle this: [`setupFiles`](https://jestjs.io/docs/configuration#setupfiles-array). Here's what the Jest documentation says about this:

> A list of paths to modules that run some code to configure or set up the testing environment. Each setupFile will be run once per test file. Since every test runs in its own environment, these scripts will be executed in the testing environment before executing `setupFilesAfterEnv{:js}` and before the test code itself.

All that I needed to do was save this snippet in a utility file (which I called **setup.js**) and update the **jest.config.js** file:

```javascript
// jest.config.js
module.exports = {
	// Other configuration options have been omitted
	setupFiles: ['path/to/setup.js']
};
```

With this change, the Jest output changed to this (some paths omitted for brevity):

```shell
  console.error
    Unhandled Rejection at: Promise {
      <rejected> Error: Oh no! An unhandled promise rejection!
          at createUnhandledRejection (unhandledRejection.test.js:2:25)
          at Object.<anonymous> (unhandledRejection.test.js:9:10)
          at Promise.then.completed (node_modules/jest-circus/build/utils.js:391:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (node_modules/jest-circus/build/utils.js:316:10)
          at _callCircusTest (node_modules/jest-circus/build/run.js:218:40)
          at processTicksAndRejections (node:internal/process/task_queues:96:5)
          at _runTest (node_modules/jest-circus/build/run.js:155:3)
          at _runTestsForDescribeBlock (node_modules/jest-circus/build/run.js:66:9)
          at run (node_modules/jest-circus/build/run.js:25:3)
          at runAndTransformResultsToJestFormat (node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
          at jestAdapter (node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
          at runTestInternal (node_modules/jest-runner/build/runTest.js:389:16)
          at runTest (node_modules/jest-runner/build/runTest.js:475:34)
          at TestRunner.runTests (node_modules/jest-runner/build/index.js:101:12)
          at TestScheduler.scheduleTests (node_modules/@jest/core/build/TestScheduler.js:333:13)
          at runJest (node_modules/@jest/core/build/runJest.js:404:19)
          at _run10000 (node_modules/@jest/core/build/cli/index.js:320:7)
          at runCLI (node_modules/@jest/core/build/cli/index.js:173:3)
          at Object.run (node_modules/jest-cli/build/cli/index.js:155:37)
    } reason: Error: Oh no! An unhandled promise rejection!
        at createUnhandledRejection (unhandledRejection.test.js:2:25)
        at Object.<anonymous> (unhandledRejection.test.js:9:10)
        at Promise.then.completed (node_modules/jest-circus/build/utils.js:391:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (node_modules/jest-circus/build/utils.js:316:10)
        at _callCircusTest (node_modules/jest-circus/build/run.js:218:40)
        at processTicksAndRejections (node:internal/process/task_queues:96:5)
        at _runTest (node_modules/jest-circus/build/run.js:155:3)
        at _runTestsForDescribeBlock (node_modules/jest-circus/build/run.js:66:9)
        at run (node_modules/jest-circus/build/run.js:25:3)
        at runAndTransformResultsToJestFormat (node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:170:21)
        at jestAdapter (node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:82:19)
        at runTestInternal (node_modules/jest-runner/build/runTest.js:389:16)
        at runTest (node_modules/jest-runner/build/runTest.js:475:34)
        at TestRunner.runTests (node_modules/jest-runner/build/index.js:101:12)
        at TestScheduler.scheduleTests (node_modules/@jest/core/build/TestScheduler.js:333:13)
        at runJest (node_modules/@jest/core/build/runJest.js:404:19)
        at _run10000 (node_modules/@jest/core/build/cli/index.js:320:7)
        at runCLI (node_modules/@jest/core/build/cli/index.js:173:3)
        at Object.run (node_modules/jest-cli/build/cli/index.js:155:37)

      2 |
      3 | process.on('unhandledRejection', (reason, promise) => {
    > 4 |       console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        |                ^
      5 |       // Application specific logging, throwing an error, or other logic here
      6 | });

      at process.<anonymous> (setup.js:4:11)

 PASS  content/posts/debugging-unhandled-rejections-in-jest/test/unhandledRejection.test.js
  ✓ Unhandled Rejection Test (2 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.705 s, estimated 1 s
```

Now I could see the issue. Here's the function that was causing the problem:

```javascript
function createUnhandledRejection() {
	return Promise.reject(new Error('Oh no! An unhandled promise rejection!'));
}

test('Unhandled Rejection Test', () => {
	expect(createUnhandledRejection()).toBeDefined();
});
```

I stupidly created a function that creates a rejected promise, almost like it was part of a contrived test for a blog post. Why did I even write such a terrible function? At least I was able to track it down thanks to this additional logging. It's important to note that this listener is not a 100% solution. It will log only what error information is passed in. In this case, a stack trace was provided from the Error, but that doesn't always happen. At the very least, the additional logging can point you in the right direction.

I'll just delete that test and forget that it ever existed. The benefit of this experience is that I should be able to track these errors down much more easily in the future. Hopefully you will too!
