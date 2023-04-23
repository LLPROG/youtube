<script lang="ts">
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { compactNumber } from '$lib/global functions/compactNumer';
	import { daysBetween } from '$lib/global functions/days_between';
	import { onMount } from 'svelte';

	export let data: PageData;

	// reactive variables
	$: videos = data.videos;

	// console logs variables
	// $: console.log(videos);
	// -------------

	let hoverVideo = false; // hover bool var for styling first video

	let likedVideos: string[] = [];

	// $: console.log(videos.length);

	onMount(() => {
		if (localStorage.likedVideos) {
			likedVideos = [...JSON.parse(localStorage.likedVideos)];
		}
	});
</script>

{#if videos.items.length === 0}
	<div class="flex justify-center pt-10">
		<p>Non sono presenti video</p>
	</div>
{:else}
	<div class="flex pt-10 ps-16">
		<!-- left fix cont -->
		<div class="basis-1/4 shrink-0 min-w-[370px] fixed">
			<div class="header border h-[85vh] rounded-2xl p-6 bg-slate-300">
				<!-- play all videos -->
				<div
					class="w-fit rounded-md h-60 flex items-center justify-center relative left-[50%] translate-x-[-50%]"
				>
					<a
						href={`/video/${videos.items[0].id}`}
						on:mouseover={() => {
							hoverVideo = true;
						}}
						on:mouseleave={() => {
							hoverVideo = false;
						}}
						on:focus={() => {
							hoverVideo = true;
						}}
						class={`phone-card bg-black h-[100%] rounded-md aspect-[9/16] flex items-center cursor-pointer ${
							hoverVideo ? 'hover-style' : ''
						}`}
					>
						<img
							src={videos.items[0].snippet.thumbnails.standard.url}
							alt={videos.items[0].snippet.title}
							class="rounded-md object-cover aspect-[9/16]"
						/>
					</a>
				</div>

				<!-- info -->
				<div class="text-white">
					<h1 class="py-3 text-2xl font-bold">Video piaciuti</h1>
					<h2 class="py-1 text-sm">{$page.data.user.name}</h2>
					<p class="pb-6 text-sm">
						{`${localStorage.likedVideos && JSON.parse(localStorage.likedVideos).length} video`}
					</p>
					<div class="buttons flex gap-2 w-full font-semibold">
						<button
							on:click={() => {
								goto(`/video/${videos.items[0].id}`);
							}}
							class="play-all flex-1 flex items-center gap-1 justify-center"
							><Icon icon="material-symbols:play-arrow" class="text-2xl" />
							<span>Riproduci tutto</span>
						</button>
						<button class="play-random flex-1 flex items-center gap-1 justify-center"
							><Icon icon="ps:random" class="text-xl" />
							<span>Casuale</span></button
						>
					</div>
				</div>
			</div>
		</div>

		<!-- right scrollable cont -->
		<div class="ms-[370px] basis-3/4 pt-3">
			<div class="index flex flex-col justify-start w-full pe-3">
				{#each videos.items as video, i (video.id)}
					<div class="flex items-center p-3 ms-1 hover:bg-slate-200 rounded-lg w-full">
						<span class="pe-4">{i + 1}</span>
						<button
							on:click={() => {
								goto(`/video/${video.id}`);
							}}
							class="cursor-pointer p-0 flex gap-2"
						>
							<div class="shrink-0">
								<img
									on:drop|preventDefault={() => {}}
									draggable="false"
									src={video?.snippet.thumbnails.standard.url}
									alt={video?.snippet.title}
									class="rounded-md object-cover aspect-video max-h-[100px]"
								/>
							</div>

							<div class="flex gap-3 text-gray-600 text-start w-full">
								<div class="flex flex-col items-start w-full">
									<h3 class="text-black font-semibold overflow-hidden max-h-[50px]">
										{video.snippet.title}
									</h3>
									<button
										on:click={(e) => {
											e.stopPropagation();
											goto(`/channel/${video.snippet.channelId}`);
										}}
										class="text-sm pt-3"
									>
										<p class="text-sm flex items-center gap-1 max-h-[50px] overflow-hidden">
											<span class="shrink-0">{video.snippet.channelTitle}</span>
											<Icon class="shrink-0" icon="mdi:dot" />
											<span class="shrink-0"
												>{compactNumber(video.statistics.viewCount)
													.toString()
													.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Visualizzazioni
											</span>
											<Icon class="shrink-0" icon="mdi:dot" />
											<span class="shrink-0">{daysBetween(video.snippet.publishedAt)}</span>
										</p>
									</button>
								</div>
							</div>
						</button>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.header {
		background: linear-gradient(
			to bottom,
			rgba(70, 79, 89, 0.8) 0%,
			rgba(70, 79, 89, 0.298) 33%,
			rgba(70, 79, 89, 0.8) 100%
		);
	}

	.play-all {
		border-radius: 20px;
		background-color: white;
		color: black;
		padding: 5px 10px;
		font-size: 14px;
	}

	.play-random {
		border-radius: 20px;
		background-color: rgba(0, 0, 0, 0.103);
		padding: 5px 10px;
		font-size: 14px;
	}

	.hover-style::after {
		content: 'RIPRODUCI TUTTO';
		color: white;
		display: flex;
		justify-content: center;
		font-size: 12px;
		align-items: center;
		position: absolute;
		inset: 0 0 0 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.611);
		border-radius: 20px;
		transition: 0.3s;
	}
</style>
