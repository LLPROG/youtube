import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch }) => {

    const auth = 'AIzaSyCm7zlrnqyZUw7yO2DU0g3vu3F6WYC4tdA';
    let channelSubscribes = [];
    channelSubscribes = [...JSON.parse(localStorage.subscribes)];

    const videosForChannelRes = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelSubscribes}&key=${auth}`, {
        method: 'get',
        headers: new Headers({
            'Accept': 'application/json'
        })
    });

    if (!videosForChannelRes.ok) {
        // throw redirect(301, '/products')
        throw error(videosForChannelRes.status, 'status')
    }

    const videosForChannel = await videosForChannelRes.json()

    return {
        videosForChannel
    }
}