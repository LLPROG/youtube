import { invalid, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	login: async ({ request, cookies, locals }) => {
		const form = await request.formData();
		const username = form.get('username');
		const password = form.get('password');

		if (!username) {
			return invalid(400, { usernameMissing: true });
		}
		if (!password) {
			return invalid(400, { passwordMissing: true, username });
		}

		cookies.set('token', 'token_value', {
			path: '/'
		});

		locals.user = { name: 'jhon', id: 1 };

		return { success: true };
	},
	logout: ({ locals, cookies }) => {
		cookies.delete('token', { path: '/' });
		locals.user = undefined;
		throw redirect(303, `/`);
	}
};
