<script lang="ts">
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { compactNumber } from '$lib/global functions/compactNumer';
	import { daysBetween } from '$lib/global functions/days_between';
	import type { PageData } from './$types';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';

	export let data: PageData;
	let videos: any[];
	if (data.videos) {
		videos = data.videos.items;
	}
	let draggableElement: any = null;
	let overDragId: any = null;
	let startDragId: any = null;
	let likedVideos: string[] = [];

	if (localStorage.likedVideos) {
		likedVideos = [...JSON.parse(localStorage.likedVideos)];
	}
	// $: console.log(videos.length);

	// drag and drop functions

	function array_move(arr: any, old_index: any, new_index: any) {
		if (new_index >= arr.length) {
			var k = new_index - arr.length + 1;
			while (k--) {
				arr.push(undefined);
			}
		}
		arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
		return arr; // for testing
	}

	function dragStart(i: any, e: any) {
		startDragId = i;
		draggableElement = null;
		// console.log(e);
		// console.log(i, 'dragstart');
		//-------------
		setTimeout(() => (e.target.style.opacity = '0.5'), 0);
		draggableElement = videos[i];
	}

	function dragEnd(i: any, e: any) {
		setTimeout(() => (e.target.style.opacity = '1'), 0);
		console.log(overDragId, 'over id');
	}

	function dragOver(i: any, e: any) {
		overDragId = i;
	}

	function dragDrop() {
		console.log('drop');
		array_move(videos, startDragId, overDragId);
		array_move(likedVideos, startDragId, overDragId);
		localStorage.likedVideos = JSON.stringify(likedVideos);
		videos = videos;
	}

	// ------------------------------->

	onMount(() => {
		console.log(JSON.parse(localStorage.likedVideos).length);
	});
</script>

{#if !localStorage.likedVideos || JSON.parse(localStorage.likedVideos).length === 0}
	<div class="flex justify-center pt-10">
		<p>Non sono presenti video</p>
	</div>
{:else}
	<div class="flex pt-10 ps-16">
		<!-- left fix cont -->
		<div class="basis-1/4 shrink-0 min-w-[370px] fixed">
			<div class="header border h-[85vh] rounded-2xl p-6 bg-slate-300">
				<!-- play all videos -->
				<div class="w-full h-60 flex items-center justify-center">
					<div class="phone-card bg-black h-[100%] rounded-xl aspect-[9/16] flex items-center">
						<img
							src={videos[0]?.snippet.thumbnails.standard.url}
							alt={videos[0]?.snippet.title}
							class="rounded-md object-cover aspect-[9/16]"
						/>
					</div>
				</div>

				<!-- info -->
				<div class="text-white">
					<h1 class="py-3 text-2xl font-bold">Video piaciuti</h1>
					<h2 class="py-1 text-sm">{$page.data.user.name}</h2>
					<p class="pb-6 text-sm">{`${JSON.parse(localStorage.likedVideos).length} video`}</p>
					<div class="buttons flex gap-2 w-full font-semibold">
						<button
							on:click={() => {
								goto(`/video/${videos[0].id}`);
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
		<div class="ms-[370px] basis-3/4">
			<div class="index flex flex-col pt-5 justify-start w-fit">
				{#each videos as video, i (video.id)}
					<div
						animate:flip={{ duration: 200 }}
						draggable="true"
						on:dragstart={(e) => {
							dragStart(i, e);
						}}
						on:dragend={(e) => {
							dragEnd(i, e);
						}}
						on:dragover|preventDefault={(e) => {
							dragOver(i, e);
						}}
						on:drop|preventDefault={() => {
							dragDrop();
						}}
						class="flex items-center grow-0 p-3 ms-1 hover:bg-slate-200 rounded-lg"
					>
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
											<span>{video.snippet.channelTitle}</span>
											<Icon icon="mdi:dot" />
											<span
												>{compactNumber(video.statistics.viewCount)
													.toString()
													.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Visualizzazioni
											</span>
											<Icon icon="mdi:dot" />
											<span>{daysBetween(video.snippet.publishedAt)}</span>
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
</style>
