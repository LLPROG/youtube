import type { HandleClientError } from '@sveltejs/kit';
// import { sequence } from '@sveltejs/kit/hooks';

export const handleError: HandleClientError = (error) => {
	console.log(error, 'This is coming from handleError.'); // Send to sentry or any error logging service.

	return {
		message: 'An unexpected error has occurred.',
		code: 'UNEXPECTED'
	};
};
