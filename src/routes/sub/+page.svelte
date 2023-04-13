<script lang="ts">
	import Icon from '@iconify/svelte';
	import { compactNumber } from '$lib/global functions/compactNumer';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let _refs: HTMLUListElement[] = [];
	let channelSubscribes: String[] = [];
	$: login = $page.data.user;
	$: channelVideos = data.videosForChannel.items;
	$: console.log(data.videosForChannel.items);

	// open menu for unsubscribe
	const openMenu = (i: any) => {
		if (_refs[i].classList.contains('hidden')) {
			_refs[i].classList.remove('hidden');
		} else {
			_refs[i].classList.add('hidden');
		}
	};

	// subscribe and unsubscribe functions
	const subscribe = (channel: any) => {
		channelSubscribes = [...channelSubscribes, channel.id];
		console.log(channelSubscribes);
		localStorage.subscribes = JSON.stringify(channelSubscribes);
	};

	const unSubscribe = (channel: any) => {
		if (localStorage.subscribes) {
			const index = channelSubscribes.indexOf(channel.id);
			console.log(index);
			channelSubscribes.splice(index, 1);
			channelSubscribes = channelSubscribes;
			console.log(channelSubscribes);
			localStorage.subscribes = JSON.stringify(channelSubscribes);
		}
	};

	onMount(() => {
		if (localStorage.subscribes) {
			channelSubscribes = [...JSON.parse(localStorage.subscribes)];
			console.log(channelSubscribes, 'on mount');
			console.log(localStorage.subscribes, 'on mount');
		}
	});
</script>

{#if login}
	{#if data.videosForChannel.items}
		<div class="sub-container pt-10 w-full flex flex-col justify-center items-center gap-10">
			{#each channelVideos as channel, i}
				<div class="sub-card flex items-center gap-2">
					<div class="shrink-0 px-10 w-80 flex items-center justify-center">
						<img
							src={channel.snippet.thumbnails.default?.url}
							alt={channel.snippet.title}
							class="thumb rounded-full w-[50%]"
						/>
					</div>
					<div class="info w-96 max-h-[136px] overflow-hidden">
						<h1 class="text-[18px] font-semibold">{channel.snippet.title}</h1>
						<p class="pt-2 flex text-[12px] text-[#606060]">
							<span class="shrink-0"
								>{`${compactNumber(channel.statistics.subscriberCount)
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} di iscritti`}
							</span>
							<Icon icon="mdi:dot" />
							<span class="overflow-hidden w-full text-ellipsis line-clamp-1">
								{`${compactNumber(channel.statistics.videoCount)
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} video`}
							</span>
						</p>
						<p class="pt-2 text-[12px] text-[#606060]">{channel.snippet?.description}</p>
					</div>
					<div class="w-40 flex items-center justify-center relative">
						{#if channelSubscribes.includes(channel.id)}
							<button class="button-standard border flex items-center gap-2">
								<Icon icon="mdi:bell-outline" class="text-xl" /> <span>Iscritto</span></button
							>
							<button on:click={() => openMenu(i)}
								><Icon icon="material-symbols:keyboard-arrow-down" class="text-xl" /></button
							>
							<ul bind:this={_refs[i]} class="absolute p-5 top-9 left-7 border rounded-md hidden">
								<li>
									<button
										on:click={() => {
											unSubscribe(channel);
											openMenu(i);
										}}
										class="flex items-center gap-2"
										><Icon icon="mdi:user-minus-outline" class="text-xl" /><span>Annulla</span
										></button
									>
								</li>
							</ul>
						{:else}
							<button
								on:click={() => {
									subscribe(channel);
								}}
								class="button-standard button-black border flex items-center gap-2"
							>
								<Icon icon="mdi:bell-outline" class="text-xl" /> <span>Iscriviti</span></button
							>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="w-full flex justify-center pt-10">
			<h1>Non sei iscritto a nessun canale</h1>
		</div>
	{/if}
{:else}
	<div class="flex justify-center items-center w-full">
		<div class="flex flex-col gap-5 items-center pt-[140px]">
			<div class="sve-cont w-[120px]">
				<svg
					viewBox="0 0 24 24"
					preserveAspectRatio="xMidYMid meet"
					focusable="false"
					class="style-scope yt-icon"
					style="pointer-events: none; display: block; width: 100%; height: 100%;"
				>
					<g class="style-scope yt-icon"
						><path
							d="M10,18v-6l5,3L10,18z M17,3H7v1h10V3z M20,6H4v1h16V6z M22,9H2v12h20V9z M3,10h18v10H3V10z"
							class="style-scope yt-icon"
						/></g
					>
				</svg>
			</div>
			<h1 class="text-3xl">Non perderti i nuovi video</h1>
			<p class="text-[#606060]">
				Accedi per vedere gli aggiornamenti dei tuoi canali preferiti di YouTube
			</p>
			<div
				class="login flex items-center gap-2 px-2 py-[3px] rounded-s-3xl rounded-e-3xl border text-blue-600 border-blue-600"
			>
				<Icon icon="ic:outline-account-circle" />
				<button
					on:click={() => {
						goto('/login');
					}}
					class="login">Accedi</button
				>
			</div>
		</div>
	</div>
{/if}

<style>
	.button-standard {
		background-color: rgb(237, 236, 236);
		/* border: 1px solid gray; */
		padding: 5px 15px;
		border-radius: 20px;
	}

	.button-black {
		background-color: black;
		color: white;
	}
</style>
