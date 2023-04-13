import type { HandleClientError } from '@sveltejs/kit';
// import { sequence } from '@sveltejs/kit/hooks';

export const handleError: HandleClientError = (error) => {
	// error, event
	console.log('This is coming from handleError.');
	console.log(error); // Send to sentry or any error logging service.

	return {
		message: 'An unexpected error has occurred.',
		code: 'UNEXPECTED'
	};
};
