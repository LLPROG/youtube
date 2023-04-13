// import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types';
import { auth } from '$lib/global variable/auth';

export const load: PageLoad = async ({ params, fetch }) => {
	const videoOfChannelRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/search?&part=snippet&maxResults=20&type=video&channelId=${params.channelId}&key=${auth}`,
		{
			method: 'get',
			headers: new Headers({
				Accept: 'application/json'
			})
		}
	);
	const videoOfChannel = await videoOfChannelRes.json();

	const ids: any = [];

	videoOfChannel.items.forEach(async (item: any) => {
		ids.push(item.id.videoId);
	});

	const videosChannelRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2C%20player%2CcontentDetails%2Cstatistics&id=${ids}&key=${auth}`,
		{
			method: 'get',
			headers: new Headers({
				Accept: 'application/json'
			})
		}
	);

	const videosChannel = videosChannelRes.json();

	return {
		videosChannel
	};
};
