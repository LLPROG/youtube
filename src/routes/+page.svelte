<script lang="ts">
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import { daysBetween } from '$lib/global functions/days_between';
	import { compactNumber } from '$lib/global functions/compactNumer';

	export let data;
	// console.log(data.videos.items[0].snippet.thumbnails.standard.url);
	$: videos = data.videos.items;
</script>

<div class="flex flex-wrap px-10 pt-5 justify-start w-fit">
	{#each videos as video}
		<div class="shrink-0 grow-0 p-2 md:basis-1/1 lg:basis-1/2 xl:basis-1/3 w-full">
			<button
				on:click={() => {
					goto(`/video/${video?.id}`);
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
						<p class="text-sm ">
							<span
								>{compactNumber(video.statistics.viewCount)
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Visualizzazioni
							</span>
							<Icon icon="ph:dot-bold" class="inline-block" />
							<span>{daysBetween(video.snippet.publishedAt)}</span>
						</p>
					</div>
				</div>
			</button>
		</div>
	{/each}
</div>

<style>
</style>
