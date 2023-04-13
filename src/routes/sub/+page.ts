import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { auth } from '$lib/global variable/auth';
export const load: PageLoad = async ({ fetch }) => {
	if (localStorage.subscribes) {
		let channelSubscribes = [];
		channelSubscribes = [...JSON.parse(localStorage.subscribes)];
		const videosForChannelRes = await fetch(
			`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelSubscribes}&key=${auth}`,
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

		const videosForChannel = await videosForChannelRes.json();

		return {
			videosForChannel
		};
	}
};
