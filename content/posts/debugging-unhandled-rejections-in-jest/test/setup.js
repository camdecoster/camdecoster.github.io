const process = require('process');

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// Application specific logging, throwing an error, or other logic here
});