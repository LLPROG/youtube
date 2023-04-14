import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
// import { beforeNavigate } from '$app/navigation';

export const load: PageLoad = async ({ parent }) => {
	// let prevPage;
	// beforeNavigate(({ from }) => {
	// 	prevPage = from?.url.pathname;
	// });
	const { user } = await parent();
	if (user) throw redirect(307, `/`);
};
