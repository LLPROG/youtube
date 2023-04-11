
import type { Load } from "$types";

export const load: Load = async ({ fetch }) => {
    const auth = 'AIzaSyCm7zlrnqyZUw7yO2DU0g3vu3F6WYC4tdA';

    const videoRes = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&chart=mostPopular&maxResults=20&key=${auth}`, {
        method: 'get',
        headers: new Headers({
            'Accept': 'application/json'
        })
    });

    const videos = await videoRes.json()

    return {
        videos
    }

}
