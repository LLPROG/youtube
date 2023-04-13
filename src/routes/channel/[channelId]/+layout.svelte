<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { compactNumber } from '$lib/global functions/compactNumer';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	export let data: LayoutData;
	console.log(data);
	$: channel = data.channel.items[0];
	let channelSubscribes: String[] = [];
	let openMenu = false;

	let lineFollow: HTMLLIElement;
	let videoButton: HTMLButtonElement;

	const moveLine = (e: any) => {
		lineFollow.style.width = `${e.target.clientWidth}px`;
		lineFollow.style.left = `${e.target.offsetLeft}px`;

		console.log(e.target.offsetLeft);
	};

	// subscribe and unsubscribe functions
	const subscribe = (channel: any) => {
		channelSubscribes = [...channelSubscribes, channel.id];
		localStorage.subscribes = JSON.stringify(channelSubscribes);
	};

	const unSubscribe = (channel: any) => {
		if (localStorage.subscribes) {
			const index = channelSubscribes.indexOf(channel.id);
			channelSubscribes.splice(index, 1);
			channelSubscribes = channelSubscribes;
			localStorage.subscribes = JSON.stringify(channelSubscribes);
		}
	};

	onMount(() => {
		lineFollow.style.left = `${videoButton.offsetLeft}px`;
		lineFollow.style.width = `${videoButton.clientWidth}px`;
		lineFollow.style.transition = '.5s';

		if (localStorage.subscribes) {
			channelSubscribes = [...JSON.parse(localStorage.subscribes)];
		}
	});
</script>

{#await channel}
	<p>loading...</p>
{:then value}
	<div class="channel">
		<!-- hero -->
		<div class="hero w-full min-h-[200px] bg-black flex items-center justify-center p-3">
			<img
				src={channel.snippet.thumbnails.medium?.url || channel.snippet.thumbnails.default?.url}
				alt=""
				class="hero-img rounded-full"
			/>
		</div>

		<!-- content -->
		<div class="details-channel border">
			<!-- info and statistics -->
			<div class="sub-card flex items-center justify-start gap-2 px-10 pt-10">
				<!-- img thumb of channel -->
				<div class="shrink-0 px-10 w-100 flex items-center justify-center">
					<img
						src={channel.snippet.thumbnails.medium.url}
						alt=""
						class="thumb rounded-full w-[80%]"
					/>
				</div>

				<!-- info channel -->
				<div class="info w-96 max-h-[136px] overflow-hidden">
					<h1 class="text-[24px] font-semibold">{channel.snippet.title}</h1>
					<p class="pt-2 flex items-center gap-2 text-[15px] text-[#606060]">
						<span class="text-black">{channel.snippet.customUrl}</span>
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
				</div>

				<!-- button subscribe unsubscribe -->
				<div class="w-40 flex items-center justify-center relative ml-auto">
					{#if channelSubscribes.includes(channel.id)}
						<button class="button-standard border flex items-center gap-2">
							<Icon icon="mdi:bell-outline" class="text-xl" /> <span>Iscritto</span></button
						>
						<button
							on:click={() => {
								openMenu = !openMenu;
							}}><Icon icon="material-symbols:keyboard-arrow-down" class="text-xl" /></button
						>
						<ul
							style:visibility={openMenu ? 'visible' : 'hidden'}
							class="absolute p-5 top-9 left-7 border rounded-md"
						>
							<li>
								<button
									on:click={(a) => {
										unSubscribe(channel);
										openMenu = !openMenu;
									}}
									class="flex items-center gap-2"
									><Icon icon="mdi:user-minus-outline" class="text-xl" /><span>Annulla</span
									></button
								>
							</li>
						</ul>
					{:else}
						<button
							on:click={(a) => {
								subscribe(channel);
							}}
							class="button-standard button-black border flex items-center gap-2"
						>
							<Icon icon="mdi:bell-outline" class="text-xl" /> <span>Iscriviti</span></button
						>
					{/if}
				</div>
			</div>

			<!-- navbar -->
			<nav class="navbar px-10-b-2">
				<ul class="flex items-center justify-center relative">
					<li>
						<button
							bind:this={videoButton}
							class="px-[32px] py-[16px]"
							on:click={(e) => {
								goto(`/channel/${channel.id}`);
								moveLine(e);
							}}>Video</button
						>
					</li>
					<li>
						<button
							class="px-[32px] py-[16px]"
							on:click={(e) => {
								goto(`/channel/${channel.id}/community`);
								moveLine(e);
							}}>Community</button
						>
					</li>
					<li>
						<button
							class="px-[32px] py-[16px]"
							on:click={(e) => {
								goto(`/channel/${channel.id}/info`);
								moveLine(e);
							}}>Informazioni</button
						>
					</li>
					<li class="border-b-4 border-black absolute bottom-0" bind:this={lineFollow} />
				</ul>
			</nav>

			<!-- sections -->
			<div class="border content">
				<div class="page-content">
					<slot />
				</div>
			</div>
		</div>
	</div>
{:catch error}
	<p>error</p>
{/await}

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
