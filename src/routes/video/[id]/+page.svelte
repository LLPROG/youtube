<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { daysBetween } from '$lib/global functions/days_between';
	import { insertStringWithLinks } from '$lib/global functions/insertStringWithLinks';
	import { compactNumber } from '$lib/global functions/compactNumer';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	$: login = $page.data.user;
	let openBannerBoolSub: Boolean = false;
	let openBannerBoolLike: Boolean = false;
	let openBannerBoolDislike: Boolean = false;

	function handleMenuClose() {
		openBannerBoolSub = false;
		openBannerBoolLike = false;
		openBannerBoolDislike = false;
		document.body.removeEventListener('click', handleMenuClose);
	}

	export let data: PageData;
	$: iframe = data.video.items[0].player.embedHtml.replace(
		'width="480" height="270"',
		'style="aspect-ratio: 16 / 9;" width="100%" height="auto"'
	);
	$: relatedVideos = data.videosByIds.items;
	$: video = data.video.items[0];
	$: channel = data.channel.items[0];
	$: comments = data.comments.items;
	// $: console.log(comments[0].snippet.topLevelComment.snippet);
	// $: console.log((data.numberComments = 40));
	// $: console.log(data.numberComments);
	$: console.log(iframe);

	let stringWithLinks = '';
	let numberComments = 20;
	let colorLikeBool = false;

	let descContainer: HTMLDivElement;
	let descButton: HTMLButtonElement;
	let infoContOpen = false;
	let counterLikedVideo: number;

	// show more text function
	const showMoreText = () => {
		descContainer.style.maxHeight = 'none';
		infoContOpen = !infoContOpen;
	};

	// show more text function
	const showLessText = () => {
		infoContOpen = !infoContOpen;
		infoDropStyle();
	};

	// info drop style function
	const infoDropStyle = () => {
		const lineHeight = parseFloat(getComputedStyle(descContainer).lineHeight);
		const linesToShow = 3;
		const containerHeight = descContainer.scrollHeight;
		const maxHeight = lineHeight * linesToShow;
		descContainer.style.maxHeight = `${maxHeight}px`;
		// console.log(containerHeight);
		// console.log(maxHeight);

		if (containerHeight > maxHeight) {
			descButton.style.display = 'block';
		}
	};

	let likedVideos: string[] = [];

	// $: colorIcon = likedVideos.includes(video.Id) ? true : false;

	// like and disLike functions
	const likeVideo = (count: any, videoId: any) => {
		if (!likedVideos.includes(videoId)) {
			counterLikedVideo = +count + 1;
			likedVideos.push(videoId);
			localStorage.likedVideos = JSON.stringify(likedVideos);
			colorLikeBool = true;
		} else {
			counterLikedVideo = +count;
			const index = likedVideos.indexOf(videoId);
			likedVideos.splice(index, 1);
			localStorage.likedVideos = JSON.stringify(likedVideos);
			colorLikeBool = false;
		}
		// console.log(likedVideos.includes(videoId));
	};

	// infiniti scroll comments function
	const handleScroll = async () => {
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
			const auth = 'AIzaSyAR1kV-4hoGodLizOvNMeQqzd18RDfTXs0';
			numberComments = numberComments + 20;
			const commentsRes = await fetch(
				`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=${numberComments}&videoId=${video.id}&textFormat=html&key=${auth}`,
				{
					method: 'get',
					headers: new Headers({
						Accept: 'application/json'
					})
				}
			).then((res) => res.json());
			comments = commentsRes.items;
			return console.log(commentsRes);
		}
	};

	let channelSubscribes: String[] = [];

	// subscribe and unsubscribe functions
	const subscribe = () => {
		channelSubscribes = [...channelSubscribes, channel.id];
		// console.log(channelSubscribes);
		localStorage.subscribes = JSON.stringify(channelSubscribes);
	};

	const unSubscribe = () => {
		if (localStorage.subscribes) {
			const index = channelSubscribes.indexOf(channel.id);
			channelSubscribes.splice(index, 1);
			channelSubscribes = channelSubscribes;
			// console.log(channelSubscribes);
			localStorage.subscribes = JSON.stringify(channelSubscribes);
		}
	};

	onMount(async () => {
		if (localStorage.subscribes) {
			channelSubscribes = [...JSON.parse(localStorage.subscribes)];
		}
		counterLikedVideo = +video.statistics.likeCount;

		if (localStorage.likedVideos) {
			likedVideos = [...JSON.parse(localStorage.likedVideos)];

			if (likedVideos.includes(video.id)) {
				counterLikedVideo = +video.statistics.likeCount + 1;
				colorLikeBool = true;
			}
		}

		infoDropStyle();

		// infiniti scroll comments function
		if ($page.url.pathname.startsWith('/video')) window.addEventListener('scroll', handleScroll);

		//--------------------------
		const inputString = video.snippet.description;
		stringWithLinks = insertStringWithLinks(inputString);
	});
</script>

<div class="flex w-full px-[24px] pt-5">
	<div class="video-cont basis-4/6">
		<!-- player -->
		<div class="iframe-cont" contenteditable="true" bind:innerHTML={iframe} />

		<!-- info details -->
		<div class="info-video">
			<!-- title -->
			<h1 class="font-bold text-xl pt-3">{video.snippet.title}</h1>

			<!-- details -->
			<div class="details flex items-center justify-between pt-3">
				<!-- left cont details -->
				<div class="left-det flex gap-3 items-center">
					<img
						src={channel?.snippet.thumbnails.default?.url ||
							channel?.snippet.thumbnails.standard?.url}
						alt=""
						class="rounded-full w-10"
					/>
					<div class="channel">
						<button
							on:click={(e) => {
								e.stopPropagation();
								goto(`/channel/${video.snippet.channelId}`);
							}}
							class="font-bold">{video.snippet.channelTitle}</button
						>
						<p class="text-gray-500 text-sm">
							{`${compactNumber(+channel.statistics.subscriberCount)} di iscritti`}
						</p>
					</div>
					{#if login}
						{#if !channelSubscribes.includes(channel.id)}
							<button on:click={subscribe} class="sub mx-3 button-standard button-black"
								>Iscriviti</button
							>
						{:else}
							<button on:click={unSubscribe} class="sub mx-3 button-standard">Iscritto</button>
						{/if}
					{:else}
						<div class="div relative mx-3">
							<button
								on:click|stopPropagation={() => {
									openBannerBoolSub = !openBannerBoolSub;
									openBannerBoolLike = false;
									openBannerBoolDislike = false;
									document.body.addEventListener('click', handleMenuClose);
								}}
								class="sub button-standard button-black">Iscriviti</button
							>
							{#if openBannerBoolSub}
								<div
									on:click|stopPropagation={() => {}}
									on:keypress|stopPropagation={() => {}}
									class="banner absolute top-9 left-0 border p-5 bg-white min-w-[380px] text-start"
								>
									<p class="py-3 flex-1">Vuoi iscriverti al canale?</p>
									<p class="py-3 text-sm">Accedi per isciverti a questo canale</p>
									<button class="py-3 text-sm text-[#065fd4]">Accedi</button>
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<!-- right content details -->
				<div class="right-det flex items-center gap-2">
					<!-- like unlike buttons -->
					{#if login}
						<div class="buttons-like-unlike button-standard flex p-0">
							<button
								on:click={() => {
									likeVideo(video.statistics.likeCount, video.id);
								}}
								class="like border-e-[1px] border-e-[gray] px-2 flex items-center gap-1"
								style:padding="5px"
							>
								<Icon
									icon={colorLikeBool ? 'mdi:like' : 'mdi:like-outline'}
									color={colorLikeBool ? 'blue' : ''}
								/>

								{counterLikedVideo}
							</button>
							<button class="dislike px-2"><Icon icon="mdi:dislike-outline" /></button>
						</div>
					{:else}
						<div class="buttons-like-unlike button-standard flex items-center p-0">
							<div class="relative">
								<button
									on:click|stopPropagation={() => {
										openBannerBoolLike = !openBannerBoolLike;
										openBannerBoolSub = false;
										openBannerBoolDislike = false;

										document.body.addEventListener('click', handleMenuClose);
									}}
									class="like border-e-[1px] border-e-[gray] px-2 flex items-center gap-1"
									style:padding="5px"
								>
									<Icon
										icon={colorLikeBool ? 'mdi:like' : 'mdi:like-outline'}
										color={colorLikeBool ? 'blue' : ''}
									/>

									{counterLikedVideo}
									{#if openBannerBoolLike}
										<div
											on:click|stopPropagation={() => {}}
											on:keypress|stopPropagation={() => {}}
											class="banner absolute top-9 left-0 border p-5 bg-white min-w-[380px] text-start"
										>
											<p class="py-3">Ti piace questo video?</p>
											<p class="py-3 text-sm">Esegui l'accesso: la tua opinione é importante</p>
											<button class="py-3 text-sm text-[#065fd4]">Accedi</button>
										</div>
									{/if}
								</button>
							</div>
							<div class="relative">
								<button
									on:click|stopPropagation={() => {
										openBannerBoolDislike = !openBannerBoolDislike;
										openBannerBoolSub = false;
										openBannerBoolLike = false;

										document.body.addEventListener('click', handleMenuClose);
									}}
									class="dislike px-2"><Icon icon="mdi:dislike-outline" /></button
								>
								{#if openBannerBoolDislike}
									<div
										on:click|stopPropagation={() => {}}
										on:keypress|stopPropagation={() => {}}
										class="banner absolute top-9 left-0 border p-5 bg-white min-w-[380px] text-start"
									>
										<p class="py-3">Questo video non ti piace?</p>
										<p class="py-3 text-sm">Esegui l'accesso: la tua opinione é importante</p>
										<button class="py-3 text-sm text-[#065fd4]">Accedi</button>
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<!-- share button -->
					<button class="share button-standard flex items-center gap-1"
						><Icon icon="mdi:share-outline" />Condividi</button
					>

					<!-- download button -->
					<button class="download button-standard flex items-center gap-1"
						><Icon icon="material-symbols:download" />Scarica</button
					>

					<!-- save button -->
					<button class="save button-standard flex items-center gap-1"
						><Icon icon="ic:twotone-playlist-add" />Salva</button
					>

					<!-- extra -->
					<button class="extra button-standard py-2"><Icon icon="mdi:dots-horizontal" /></button>
				</div>
			</div>
		</div>

		<!-- info user video -->
		<div style:line-Height="1.5rem" class="mt-4 bg-gray-300 p-2 rounded-md">
			<div bind:this={descContainer} class="info-use overflow-hidden">
				<!-- views and publish -->
				<p class="font-bold">
					<span
						>{`${compactNumber(+video.statistics.viewCount)
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} visualizzazioni`}
					</span>
					<span>
						{daysBetween(video.snippet.publishedAt)}
					</span>
				</p>
				<!-- description -->
				<p bind:innerHTML={stringWithLinks} contenteditable="false" class="" />
			</div>
			<button
				class="font-semibold"
				bind:this={descButton}
				on:click={() => {
					if (!infoContOpen) {
						showMoreText();
					} else {
						showLessText();
					}
				}}>{!infoContOpen ? 'Mostra Altro' : 'Mostra Meno'}</button
			>
		</div>

		<!-- comments -->
		<div class="comments">
			<!-- header comments -->
			<div class="header py-4 flex gap-5">
				<span>{`${comments?.length} commenti`}</span>
				<div class="order">
					<button>Ordina per</button>
					<ul class="hidden">
						<li><button>Commenti popolari</button></li>
						<li><button>dal piu recente</button></li>
					</ul>
				</div>
			</div>

			<div class="add-comments">
				{#if login}
					<div class="user-inner-comment flex items-center gap-4">
						<div
							class="thumb flex justify-center items-center overflow-hidden w-12 h-12 bg-slate-400 rounded-full"
						>
							{login.name.charAt(0).toUpperCase()}
						</div>
						<input type="text" placeholder="aggiungi un commento" />
					</div>
				{:else}
					<button
						on:click={() => {
							goto('/login');
						}}
						class="border flex items-center gap-2"
					>
						<div
							class="thumb text-blue-600 border overflow-hidden border-blue-600 w-12 h-12 flex justify-center items-center rounded-full text-5xl"
						>
							<Icon icon="mdi:account" />
						</div>
						<input type="text" placeholder="aggiungi un commento" class="pointer-events-none" />
					</button>
				{/if}
			</div>

			<div class="comments-list flex flex-col gap-5 mt-4">
				{#each comments as comment}
					<div class="comment-cont flex gap-5">
						<div class="user-thum shrink-0 w-12">
							<img
								class="rounded-full w-full"
								src={comment.snippet.topLevelComment.snippet?.authorProfileImageUrl}
								alt={comment.snippet.topLevelComment.snippet.authorDisplayName.charAt(0)}
							/>
						</div>
						<div class="comment-details flex flex-col gap-1">
							<p class="flex items-center gap-3">
								<span class="user font-bold"
									>{comment.snippet.topLevelComment.snippet.authorDisplayName}</span
								><span>{daysBetween(comment.snippet.topLevelComment.snippet.publishedAt)}</span>
							</p>
							<p>{comment.snippet.topLevelComment.snippet.textOriginal}</p>
							<div class="buttons-like-unlike flex">
								<button class="like flex items-center gap-1" style:padding="5px"
									><Icon icon="mdi:like-outline" />{comment.snippet.topLevelComment.snippet
										.likeCount}</button
								>
								<button class="dislike px-2"><Icon icon="mdi:dislike-outline" /></button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- right-bar video correlati  -->
	<div class="right-bar basis-2/6 ps-[24px] flex flex-col gap-4 min-w-[300px]">
		{#each relatedVideos as RelatedVideo}
			<button
				on:click={() => {
					goto(`/video/${RelatedVideo.id}`);
					console.log(RelatedVideo);
				}}
				class="video-cont text-start flex gap-2"
			>
				<div class="video-thumb shrink-0 grow-0">
					<img
						class="object-cover aspect-video max-w-[168px] rounded-lg"
						src={RelatedVideo.snippet.thumbnails.standard?.url}
						alt=""
					/>
				</div>
				<div class="video-info">
					<h1
						class="font-semibold text-[14px] overflow-hidden w-full max-h-12 text-ellipsis line-clamp-2"
					>
						{RelatedVideo.snippet.title}
					</h1>
					<button
						on:click={(e) => {
							e.stopPropagation();
							goto(`/channel/${RelatedVideo.snippet.channelId}`);
						}}
						class="mt-2 channel text-left text-[12px] overflow-hidden w-full text-[#606060] text-ellipsis line-clamp-1"
					>
						{RelatedVideo.snippet.channelTitle}
					</button>
					<div class="view-publiched flex gap-1 text-[12px] text-[#606060]">
						<span class="shrink-0"
							>{`${compactNumber(+RelatedVideo.statistics.viewCount)
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} visualizzazioni`}
						</span>
						<Icon icon="mdi:dot" />
						<span class="overflow-hidden w-full text-ellipsis line-clamp-1">
							{daysBetween(RelatedVideo.snippet.publishedAt)}
						</span>
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>

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
