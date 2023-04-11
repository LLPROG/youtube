import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch }) => {
    const auth = 'AIzaSyCm7zlrnqyZUw7yO2DU0g3vu3F6WYC4tdA';

    const videoRes = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=${[...JSON.parse(localStorage.likedVideos)]}&key=${auth}`, {
        method: 'get',
        headers: new Headers({
            'Accept': 'application/json'
        })
    });

    // if (!videoRes.ok) {
    //     // throw redirect(301, '/products')
    //     throw redirect(303, '/')
    // }

    const videos = await videoRes.json()

    return {
        videos
    }
}
