import type { Handle, HandleServerError, HandleFetch } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

export const handle1: Handle = async ({ event, resolve }) => {
	const { locals, cookies } = event;

	const token = cookies.get('token');

	locals.user = token ? { name: `jhon`, id: 1 } : undefined;

	const response = await resolve(event);

	return response;
};

export const handle = sequence(handle1);

export const handleFetch: HandleFetch = ({ request, event, fetch }) => {
	if (request.url.startsWith('https://dummyjson.com/')) {
		const cookie = event.request.headers.get('cookie');
		if (cookie) {
			request.headers.set('cookie', cookie);
		}
	}
	return fetch(request);
};

export const handleError: HandleServerError = ({ error }) => {
	// console.log('This is coming from handleError.');
	console.log(error, 'hookError'); // Send to sentry or any error logging service.

	return {
		message: 'An unexpected error has occurred.',
		code: 'UNEXPECTED'
	};
};
