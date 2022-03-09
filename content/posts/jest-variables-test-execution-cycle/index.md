---
title: "Jest, Variables, and the Test Execution Cycle"
description: "(Or the danger of using the same variable to run dynamic tests in a loop)"
date: 2022-03-08T08:44:31-07:00
tags: ["devblog", "javascript", "jest", "scope"]
image: "/posts/jest-variables-test-execution-cycle/images/header.png"
type: post
---

![image alt text](/posts/jest-variables-test-execution-cycle/images/header.png "Image title text")

I recently ran into an issue with trying to write some unit tests for a charting component in [Jest](https://jestjs.io/). This component had three configuration options, so I wanted to test each one. This involved adding an event listener, setting the configuration for a test, triggering the event, and reviewing the data that was returned by the listener. Since I was running the same test three times, I decided to use a loop. I've done this before and it has worked without issue. But not this time.

Let's take a look at a simplified version of the test I was running:

```javascript
const events = require('events');

// Use fake timers so as not to have to wait in real time
jest.useFakeTimers();

// Create mock function to track calls, arguments
const callback = jest.fn();

const emitter = new events.EventEmitter();

// Set up listener
emitter.on('TRIGGER', args => { callback(args); });

const positions = [
	'center',
	'left',
	'right'
];
const paramsObject = { position: null };

describe('Position emitter', () => {
	beforeEach(() => {
		// Reset mock callback function
		callback.mockReset();

		// Emit the position
		emitter.emit('TRIGGER', paramsObject.position);

		// Make sure all timers have executed
		jest.runAllTimers();
	});

    for (const position of positions) {
		paramsObject.position = position;

		test('Checks the position', () => {
			const emittedPosition = callback.mock.calls[0][0];
			
			expect(emittedPosition).toBe(position);
		});
	}
});
```

If you run this test, you'll see that the assertions from the first two passes through the loop fail (seeing an emitted position of `'right'`), while the third pass works.

```shell
 FAIL  content/posts/jest-variables-test-execution-cycle/failingLoop.test.js
  Position emitter
    ✕ Checks the position (7 ms)
    ✕ Checks the position (2 ms)
    ✓ Checks the position (1 ms)

  ● Position emitter › Checks the position

    expect(received).toBe(expected) // Object.is equality

    Expected: "center"
    Received: "right"

      37 |                      const emittedPosition = callback.mock.calls[0][0];
      38 | 
    > 39 |                      expect(emittedPosition).toBe(position);
         |                                              ^
      40 |              });
      41 |      }
      42 | });

      at Object.<anonymous> (content/posts/jest-variables-test-execution-cycle/failingLoop.test.js:39:28)

  ● Position emitter › Checks the position

    expect(received).toBe(expected) // Object.is equality

    Expected: "left"
    Received: "right"

      37 |                      const emittedPosition = callback.mock.calls[0][0];
      38 | 
    > 39 |                      expect(emittedPosition).toBe(position);
         |                                              ^
      40 |              });
      41 |      }
      42 | });

      at Object.<anonymous> (content/posts/jest-variables-test-execution-cycle/failingLoop.test.js:39:28)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 1 passed, 3 total
Snapshots:   0 total
Time:        0.529 s
```

What's going on here? The beforeEach block should run first, then the test, for each pass through the loop. Let's walk this through in a bit more detail:

1. Set the global variable value, `paramsObject.position`, to the current `position` value
1. Enter the beforeEach block
	1. Reset the mock
	1. Emit `paramsObject.position`
1. Get the emitted position value from the mock function ([first function call][first argument from function call])
1. Assert that `emittedPosition` should match `position`

That all seems correct, but it doesn't work. The issue is a result of the Jest test execution cycle, and it's something that developers should be aware of. Here's a breakdown of what Jest does when it opens a test file:

1. Execute top level statements
1. Execute `describe` blocks, in order
1. If a test is found, add that to a list of tests to execute, along with any related `beforeEach`, `afterEach`, etc. blocks.
1. Go through the test list and run each test in order

You'll notice that the tests don't actually get run until the end of the cycle. Because the loop is part of a describe block, it gets executed as part of step 2. While Jest is building a list of tests (without running them), `paramsObject.position` is set three times, with the final value being `'right'`. By the time the tests are actually run, `paramsObject.position` isn't changing anymore, so the first two tests fail because they're expecting `emittedPosition` to match `position`, and it doesn't.

Ultimately, this is a scope issue. Because the value that's changing is global, it doesn't get saved in it's current state at the time the test is created. The solution is stop using a global variable. Here's how I changed the test to work the way I expected:

```javascript
const events = require('events');

// Use fake timers so as not to have to wait in real time
jest.useFakeTimers();

// Create mock function to track calls, arguments
const callback = jest.fn();

const emitter = new events.EventEmitter();

// Set up listener
emitter.on('TRIGGER', args => { callback(args); });

const positions = [
	'center',
	'left',
	'right'
];

describe('Position emitter', () => {
	function triggerEvent(position) {
		// Reset mock callback function
		callback.mockReset();

		// Emit the position
		emitter.emit('TRIGGER', position);

		// Make sure all timers have executed
		jest.runAllTimers();
	}

	for (const position of positions) {
		test('Checks the position', () => {
			// Use function instead of beforeEach, along with reference to 'position' instead of paramsObject.position
			triggerEvent(position);

			const emittedPosition = callback.mock.calls[0][0];

			expect(emittedPosition).toBe(position);
		});
	}
});
```

Essentially, I'm creating my own local `beforeEach` block in the form of the function `triggerEvent`, which get's called with the locally scoped `position`. Other than that change, the code is pretty much the same. But now the correct value is emitted for each pass through the loop. Here's the Jest output:

```shell
 PASS  content/posts/jest-variables-test-execution-cycle/passingLoop.test.js
  Position emitter
    ✓ Checks the position (3 ms)
    ✓ Checks the position (1 ms)
    ✓ Checks the position (1 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.471 s
```

The lesson to learn here is that one should be careful when mutating global variables in a test, as they might not change at the time that you expect. Another lesson is that you should learn more about the test execution cycle for your testing software of choice. The pages that helped me figure this out are the Jest documentation on [setup and teardown](https://jestjs.io/docs/setup-teardown#order-of-execution-of-describe-and-test-blocks), and this Stack Overflow [post](https://stackoverflow.com/a/56250763). I hope this information helps you in the future.