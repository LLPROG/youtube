import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { auth } from '$lib/global variable/auth';

export const load: LayoutLoad = async ({ params, fetch }) => {
	const channelRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${params.channelId}&key=${auth}`
	);
	const channel = channelRes.json();

	const communityRes = await fetch(
		`https://yt.lemnoslife.com/channels?part=community,about&id=${params.channelId}`,
		{
			method: 'get',
			headers: new Headers({
				Accept: 'application/json'
			})
		}
	);

	const community = communityRes.json();

	console.log(channelRes.status);

	if (!channelRes.ok) {
		throw redirect(301, '/');
	}

	return {
		channel,
		community
	};
};
