import type { Load } from '$types';
import { auth } from '$lib/global variable/auth';
// import { error } from '@sveltejs/kit';

export const load: Load = async ({ fetch }) => {
	const videoRes = await fetch(
		`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&chart=mostPopular&maxResults=20&key=${auth}`
	);

	if (!videoRes.ok) {
		return { videos: [] };
	}

	const videos = await videoRes.json();

	return {
		videos
	};
};
