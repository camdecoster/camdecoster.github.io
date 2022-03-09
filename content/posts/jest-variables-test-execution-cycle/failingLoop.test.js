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