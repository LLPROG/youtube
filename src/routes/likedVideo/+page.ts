import type { PageLoad } from './$types';
import { auth } from '$lib/global variable/auth';
import { userLocals } from '../../lib/stores/store';
export const load: PageLoad = async ({ fetch }) => {
	let likedVideosLocals;
	userLocals.subscribe((value) => {
		likedVideosLocals = value.likedVideos ? value.likedVideos : null;
	});

	if (likedVideosLocals) {
		const videoRes = await fetch(
			`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=${likedVideosLocals}&key=${auth}`,
			{
				method: 'get',
				headers: new Headers({
					Accept: 'application/json'
				})
			}
		);

		const videos = await videoRes.json();

		return {
			videos
		};
	} else {
		return {
			videos: []
		};
	}
};
