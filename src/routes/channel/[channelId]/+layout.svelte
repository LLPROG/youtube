<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { compactNumber } from '$lib/global functions/compactNumer';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { userLocals } from '$lib/stores/store';
	import { browser } from '$app/environment';

	export let data: LayoutData;

	// reactive variables
	$: channel = data.channel.items[0];
	//------------------

	// console logs
	// console.log(data);
	// --------------

	let channelSubscribes: String[] = [];
	let openMenu = false; // var bool open menu subscribers

	let lineFollow: HTMLLIElement; // underline header menu
	let videoButton: HTMLButtonElement; // video button header menu

	// animation underline header function
	const moveLine = (e: any) => {
		lineFollow.style.width = `${e.target.clientWidth}px`;
		lineFollow.style.left = `${e.target.offsetLeft}px`;

		console.log(e.target.offsetLeft);
	};

	// subscribe and unsubscribe functions
	const subscribe = (channel: any) => {
		channelSubscribes = [...channelSubscribes, channel.id];
		localStorage.subscribes = JSON.stringify(channelSubscribes);
		userLocals.subscribe((value) => {
			value.subscribers = [...JSON.parse(localStorage.subscribes)];
		});
	};

	const unSubscribe = (channel: any) => {
		if (localStorage.subscribes) {
			const index = channelSubscribes.indexOf(channel.id);
			channelSubscribes.splice(index, 1);
			channelSubscribes = channelSubscribes;
			localStorage.subscribes = JSON.stringify(channelSubscribes);
			userLocals.subscribe((value) => {
				value.subscribers = [...JSON.parse(localStorage.subscribes)];
			});
		}
	};
	// -------------------

	onMount(() => {
		lineFollow.style.left = `${videoButton.offsetLeft}px`;
		lineFollow.style.width = `${videoButton.clientWidth}px`;
		lineFollow.style.transition = '.5s';

		if (localStorage.subscribes) {
			channelSubscribes = [...JSON.parse(localStorage.subscribes)];
			userLocals.subscribe((value) => {
				value.subscribers = [...JSON.parse(localStorage.subscribes)];
			});
		}
	});
</script>

{#if browser}
	<div>
		<!-- hero -->
		<div class="w-full min-h-[250px] bg-black flex items-center justify-center p-3">
			<img
				src={channel.snippet.thumbnails.medium?.url || channel.snippet.thumbnails.default?.url}
				alt={channel.snippet.title}
				class="rounded-full"
			/>
		</div>

		<!-- content -->
		<div>
			<!-- info and statistics -->
			<div class="flex items-center justify-start gap-2 px-10 pt-10">
				<!-- img thumb of channel -->
				<div class="shrink-0 px-10 w-100 flex items-center justify-center">
					<img
						src={channel.snippet.thumbnails.medium.url}
						alt={channel.snippet.title}
						class="rounded-full w-[80%]"
					/>
				</div>

				<!-- info channel -->
				<div class="w-96 max-h-[136px] overflow-hidden">
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
						<button
							on:click={() => {
								openMenu = !openMenu;
							}}
							class="button-standard border flex items-center gap-2"
						>
							<Icon icon="mdi:bell-outline" class="text-xl" /> <span>Iscritto</span><Icon
								icon="material-symbols:keyboard-arrow-down"
								class="text-xl"
							/></button
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
			<nav class="px-10-b-2">
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
			<div>
				<div>
					<slot />
				</div>
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
