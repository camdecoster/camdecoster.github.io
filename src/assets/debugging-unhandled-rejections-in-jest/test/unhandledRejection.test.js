function createUnhandledRejection() {
	return Promise.reject(new Error('Oh no! An unhandled promise rejection!'));
}

test('Unhandled Rejection Test', () => {
	expect(createUnhandledRejection()).toBeDefined();
});