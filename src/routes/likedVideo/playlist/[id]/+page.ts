import { error } from '@sveltejs/kit'
import type { PageLoad } from '../$types'

export const load: PageLoad = async ({ params, fetch }) => {

    const auth = 'AIzaSyCm7zlrnqyZUw7yO2DU0g3vu3F6WYC4tdA';

    const videoRes = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2C%20player%2CcontentDetails%2Cstatistics&id=${params.id}&key=${auth}`, {
        method: 'get',
        headers: new Headers({
            'Accept': 'application/json'
        })
    });

    const video = await videoRes.json();

    const videosByIdsRes = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2C%20player%2CcontentDetails%2Cstatistics&id=${[...JSON.parse(localStorage.likedVideos)]}&key=${auth}`, {
        method: 'get',
        headers: new Headers({
            'Accept': 'application/json'
        })
    });

    const videosByIds = await videosByIdsRes.json()
    const commentsRes = await fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=20&videoId=${video.items[0].id}&textFormat=html&key=${auth}`, {
        method: 'get',
        headers: new Headers({
            'Accept': 'application/json'
        })
    });

    const channelRes = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${video.items[0].snippet.channelId}&key=${auth}`)
    const channel = channelRes.json();

    const comments = await commentsRes.json()

    if (!videoRes.ok) {
        // throw redirect(301, '/products')
        throw error(videoRes.status, 'Video non trovato')
    }

    return {
        videosByIds,
        video,
        comments,
        channel
    }
}