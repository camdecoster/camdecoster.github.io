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