<script lang="ts">
	import Icon from '@iconify/svelte';
	import { daysBetween } from '$lib/global functions/days_between';
	import { compactNumber } from '$lib/global functions/compactNumer';

	export let data;
	$: videos = data.videos.items;
	// $: console.log(data.videos);
</script>

<!-- videos container -->
<div class="flex flex-wrap px-10 pt-5 justify-start w-fit">
	{#each videos as video}
		<!-- video card cont -->
		<div class="shrink-0 grow-0 p-2 md:basis-1/1 lg:basis-1/2 xl:basis-1/3 w-full">
			<!-- video card -->
			<a href={`/video/${video?.id}`} class="cursor-pointer p-0">
				<div>
					<img
						src={video.snippet.thumbnails.standard?.url}
						alt={video.snippet.title}
						class="rounded-xl object-cover aspect-video"
					/>
				</div>

				<div class="flex gap-3 mt-4 text-secondary-color text-start">
					<img
						src={video.snippet.thumbnails.standard?.url}
						alt={video.snippet.title}
						class="rounded-full w-10 h-10"
					/>
					<div class="flex flex-col items-start">
						<h3
							class="text-primary-color font-semibold overflow-hidden w-full max-h-12 text-ellipsis line-clamp-2"
						>
							{video.snippet.title}
						</h3>
						<a href={`/channel/${video.snippet.channelId}`} class="text-sm"
							>{video.snippet.channelTitle}</a
						>
						<p class="text-sm">
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
			</a>
		</div>
	{/each}
</div>

<style>
</style>
