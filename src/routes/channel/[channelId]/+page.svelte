<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { compactNumber } from '$lib/global functions/compactNumer';
	import { daysBetween } from '$lib/global functions/days_between';
	import { onMount } from 'svelte';
	export let data: PageData;
	$: videos = data.videosChannel.items;
	// console.log(data);
	onMount(() => {
		document.body.scrollTo(0, 0);
	});
</script>

<div class="flex flex-wrap px-10 justify-start w-fit">
	{#each videos as video}
		<div class="shrink-0 grow-0 p-3 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 w-full min-w-[19vw]">
			<button
				on:click={() => {
					goto(`/video/${video.id}`);
				}}
				class="cursor-pointer p-0"
			>
				<div>
					<img
						src={video.snippet.thumbnails.standard?.url}
						alt={video.snippet.title}
						class="rounded-xl object-cover aspect-video"
					/>
				</div>

				<div class="flex gap-3 mt-4 text-gray-600 text-start">
					<img src={video.snippet.thumbnails.standard?.url} alt="" class="rounded-full w-10 h-10" />
					<div class="flex flex-col items-start">
						<h3
							class="text-black font-semibold overflow-hidden w-full max-h-12 text-ellipsis line-clamp-2"
						>
							{video.snippet.title}
						</h3>
						<button
							on:click={(e) => {
								e.stopPropagation();
								goto(`/channel/${video.snippet.channelId}`);
							}}
							class="text-sm">{video.snippet.channelTitle}</button
						>
						<p class="text-sm">
							<span
								>{compactNumber(video.statistics.viewCount)
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Visualizzazioni -
							</span>
							<span>{daysBetween(video.snippet.publishedAt)}</span>
						</p>
					</div>
				</div>
			</button>
		</div>
	{/each}
</div>
