import type { PageLoad } from './$types';
import { auth } from '$lib/global variable/auth';
export const load: PageLoad = async ({ fetch }) => {
	if (localStorage.likedVideos) {
		const videoRes = await fetch(
			`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=${[
				...JSON.parse(localStorage.likedVideos)
			]}&key=${auth}`,
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
	}
};
