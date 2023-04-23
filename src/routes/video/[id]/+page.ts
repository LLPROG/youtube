import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { auth } from '$lib/global variable/auth';
import { userLocals } from '../../../lib/stores/store';

export const load: PageLoad = async ({ params, fetch }) => {
	const videoRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2C%20player%2CcontentDetails%2Cstatistics&id=${params.id}&key=${auth}`
	);

	const video = await videoRes.json();

	const relatedVideosRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/search?&part=snippet&maxResults=20&type=video&relatedToVideoId=${params.id}&key=${auth}`
	);

	const relatedVideos = await relatedVideosRes.json();

	const ids: string[] = [];

	relatedVideos.items.forEach(async (item: any) => {
		ids.push(item.id.videoId);
	});

	const videosByIdsRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2C%20player%2CcontentDetails%2Cstatistics&id=${ids}&key=${auth}`
	);

	const videosByIds = await videosByIdsRes.json();

	let likedVideos = [];
	let likedVideosLocals;

	userLocals.subscribe((value) => {
		likedVideosLocals = value.likedVideos ? value.likedVideos : null;
	});

	if (likedVideosLocals) {
		const likedVideosRes = await fetch(
			`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2C%20player%2CcontentDetails%2Cstatistics&id=${likedVideosLocals}&key=${auth}`
		);

		likedVideos = await likedVideosRes.json();
	}

	const commentsRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=20&videoId=${video.items[0].id}&textFormat=html&key=${auth}`
	);

	const channelRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${video.items[0].snippet.channelId}&key=${auth}`
	);

	const channel = await channelRes.json();
	const comments = await commentsRes.json();

	return {
		videosByIds,
		video,
		comments,
		channel,
		likedVideos
	};
};
