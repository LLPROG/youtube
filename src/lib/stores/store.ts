import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const userLocals = writable({
	subscribers: browser && localStorage.subscribes ? [...JSON.parse(localStorage.subscribes)] : [],
	likedVideos: browser && localStorage.likedVideos ? [...JSON.parse(localStorage.likedVideos)] : []
});
