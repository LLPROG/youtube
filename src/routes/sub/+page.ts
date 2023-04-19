import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { auth } from '$lib/global variable/auth';
import { userLocals } from '../../lib/stores/store';

export const load: PageLoad = async ({ fetch }) => {
	let sub;
	userLocals.subscribe((value) => {
		sub = value.subscribers ? value.subscribers : null;
	});

	if (sub) {
		const videosForChannelRes = await fetch(
			`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${sub}&key=${auth}`,
			{
				method: 'get',
				headers: new Headers({
					Accept: 'application/json'
				})
			}
		);

		if (!videosForChannelRes.ok) {
			throw redirect(301, '/');
		}

		return {
			videosForChannel: videosForChannelRes.json()
		};
	} else {
		return {
			videosForChannel: []
		};
	}
};
