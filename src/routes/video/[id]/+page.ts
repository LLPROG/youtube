import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { auth } from '$lib/global variable/auth';

export const load: PageLoad = async ({ params, fetch }) => {
	const videoRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2C%20player%2CcontentDetails%2Cstatistics&id=${params.id}&key=${auth}`,
		{
			method: 'get',
			headers: new Headers({
				Accept: 'application/json'
			})
		}
	);

	const video = await videoRes.json();

	const relatedVideosRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/search?&part=snippet&maxResults=20&type=video&relatedToVideoId=${params.id}&key=${auth}`,
		{
			method: 'get',
			headers: new Headers({
				Accept: 'application/json'
			})
		}
	);

	const relatedVideos = await relatedVideosRes.json();

	const ids: any = [];

	relatedVideos.items.forEach(async (item: any) => {
		ids.push(item.id.videoId);
	});

	const videosByIdsRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2C%20player%2CcontentDetails%2Cstatistics&id=${ids}&key=${auth}`,
		{
			method: 'get',
			headers: new Headers({
				Accept: 'application/json'
			})
		}
	);

	const videosByIds = await videosByIdsRes.json();

	let likedVideos = null;

	if (localStorage.likedVideos) {
		const likedVideosRes = await fetch(
			`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2C%20player%2CcontentDetails%2Cstatistics&id=${[
				...JSON.parse(localStorage.likedVideos)
			]}&key=${auth}`,
			{
				method: 'get',
				headers: new Headers({
					Accept: 'application/json'
				})
			}
		);

		likedVideos = await likedVideosRes.json();
	}

	const commentsRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=20&videoId=${video.items[0].id}&textFormat=html&key=${auth}`,
		{
			method: 'get',
			headers: new Headers({
				Accept: 'application/json'
			})
		}
	);

	const channelRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${video.items[0].snippet.channelId}&key=${auth}`
	);
	const channel = channelRes.json();

	const comments = await commentsRes.json();

	if (!videoRes.ok) {
		// throw redirect(301, '/products')
		throw error(videoRes.status, 'Video non trovato');
	}

	return {
		videosByIds,
		video,
		comments,
		channel,
		likedVideos
	};
};
