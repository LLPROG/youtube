<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { daysBetween } from '$lib/global functions/days_between';
	import { insertStringWithLinks } from '$lib/global functions/insertStringWithLinks';
	import { compactNumber } from '$lib/global functions/compactNumer';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { afterNavigate, goto } from '$app/navigation';
	import { auth } from '$lib/global variable/auth';
	export let data: PageData;

	$: login = $page.data.user;
	let prevPage: any = '';
	let openBannerBoolSub: Boolean = false;
	let openBannerBoolLike: Boolean = false;
	let openBannerBoolDislike: Boolean = false;
	let focused: Boolean = false;
	let focusedModify: Boolean = false;
	let textComment = '';
	let textCommentModify = '';
	let comments: any;
	let likedVideosRes: any;
	let stringWithLinks = '';
	let numberComments = 20;

	let descContainer: HTMLDivElement;
	let descButton: HTMLButtonElement;
	let infoContOpen = false;
	let counterLikedVideo: number;
	let likedVideos: string[] = [];
	let channelSubscribes: String[] = [];
	let hover = false;
	let showMenuComment = false;
	let modifyCommentBool = false;
	let comment: any;
	// $: console.log(comments);

	$: iframe = data.video.items[0].player.embedHtml
		.replace(
			'width="480" height="270"',
			'style="aspect-ratio: 16 / 9;" width="100%" height="auto" min-height="500px"'
		)
		.replace('" frameborder="0"', '?autoplay=1" frameborder="0"');

	$: relatedVideos = data.videosByIds.items;
	$: video = data.video.items[0];
	$: channel = data.channel.items[0];
	$: comments = data.comments.items;
	$: colorLikeBool = false;

	if (data.likedVideos) {
		likedVideosRes = data.likedVideos.items;
	}
	// $: console.log(comments[0].snippet.topLevelComment.snippet);
	// $: console.log((data.numberComments = 40));
	// $: console.log(data.numberComments);
	$: console.log(iframe);

	// add, modify and delete comments functions
	const addComment = () => {
		comment = {
			id: 'myid',
			snippet: {
				topLevelComment: {
					snippet: {
						textOriginal: textComment,
						authorDisplayName: $page.data.user.name,
						likeCount: 0,
						publishedAt: Date.now(),
						authorProfileImageUrl: 'user'
					}
				}
			}
		};
		if (comments) {
			comments.unshift(comment);
		} else {
			comments = [];
			comments.push(comment);
			console.log(comments);
		}
		comments = comments;
		textComment = '';
		textCommentModify = '';
		focused = false;
		modifyCommentBool = false;
	};

	const modifyComment = () => {
		textComment = textCommentModify;
		console.log(comment);
		comments.splice(comments.indexOf(comment), 1);
		addComment();
		modifyCommentBool = false;
		showMenuComment = false;
		console.log(modifyCommentBool);
		console.log(showMenuComment);
	};

	const deleteComment = () => {
		comments.splice(comments.indexOf(comment), 1);
		comments = comments;
		modifyCommentBool = false;
		showMenuComment = false;
	};

	// --------------- >

	// close banner menus when click outside
	function handleMenuClose() {
		openBannerBoolSub = false;
		openBannerBoolLike = false;
		openBannerBoolDislike = false;
		document.body.removeEventListener('click', handleMenuClose);
	}

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
		if (document.body.scrollTop + document.body.offsetHeight >= document.body.scrollHeight) {
			numberComments += 20;
			const commentsRes = await fetch(
				`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=${numberComments}&videoId=${video.id}&textFormat=html&key=${auth}`,
				{
					method: 'get',
					headers: new Headers({
						Accept: 'application/json'
					})
				}
			).then((res) => res.json());
			return (comments = commentsRes.items);
			//return console.log(commentsRes);
		}
	};

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
			} else {
				counterLikedVideo = +video.statistics.likeCount;
				colorLikeBool = false;
			}
		}

		infoDropStyle();

		// infiniti scroll comments function
		// console.log('video');
		document.body.addEventListener('scroll', handleScroll);

		//--------------------------
		const inputString = video.snippet.description;
		stringWithLinks = insertStringWithLinks(inputString);
	});

	afterNavigate(({ from }) => {
		prevPage = from?.url.pathname;
		counterLikedVideo = +video.statistics.likeCount;
		if (localStorage.likedVideos) {
			likedVideos = [...JSON.parse(localStorage.likedVideos)];

			if (likedVideos.includes(video.id)) {
				counterLikedVideo = +video.statistics.likeCount + 1;
				colorLikeBool = true;
			} else {
				counterLikedVideo = +video.statistics.likeCount;
				colorLikeBool = false;
			}
		}
	});
</script>

<div class="flex w-full px-[24px] pt-5">
	<div class="video-cont basis-4/6">
		<!-- player -->
		<div
			class="iframe-cont w-full min-h-[500px] aspect-auto"
			contenteditable="true"
			bind:innerHTML={iframe}
		/>

		<!-- info details -->
		<div class="info-video">
			<!-- title -->
			<h1 class="font-bold text-xl pt-3">{video.snippet.title}</h1>

			<!-- details -->
			<div class="details flex items-center justify-between pt-3">
				<!-- left cont details -->
				<div class="left-det flex gap-3 items-center w-full">
					<img src={channel?.snippet.thumbnails.standard?.url} alt="" class="rounded-full w-10" />
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

					<!-- download button 
					<button class="download button-standard flex items-center gap-1"
						><Icon icon="material-symbols:download" />Scarica</button
					> -->

					<!-- save button 
					<button class="save button-standard flex items-center gap-1"
						><Icon icon="ic:twotone-playlist-add" />Salva</button
					> -->

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
				<p bind:innerHTML={stringWithLinks} contenteditable="false" />
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
				{#if comments}
					<span>{`${comments.length} commenti`}</span>
				{/if}
				<div class="order">
					<button>Ordina per</button>
					<ul class="hidden">
						<li><button>Commenti popolari</button></li>
						<li><button>dal piu recente</button></li>
					</ul>
				</div>
			</div>

			<div class="add-comments pb-4">
				{#if login}
					<div class="user-inner-comment flex items-start gap-4">
						<div
							class="shrink-0 flex justify-center items-center overflow-hidden w-12 h-12 bg-slate-400 rounded-full"
						>
							{login.name.charAt(0).toUpperCase()}
						</div>
						<div class="w-full flex flex-col gap-2 relative">
							<input
								bind:value={textComment}
								on:focus={() => {
									focused = true;
								}}
								class="focus:outline-none border-b-[1px] w-full z-10"
								type="text"
								placeholder="Aggiungi un commento..."
							/>
							<div
								class="line absolute top-6 border-b-2 border-black origin-center transition-[.5s] w-full"
								style:transform={focused ? 'scale(1)' : 'scale(0)'}
							/>
							<div
								style:height={focused ? '100%' : '0'}
								class="buttons flex pt-2 justify-end gap-2 overflow-hidden"
							>
								<button
									on:click={() => {
										focused = false;
									}}
									class="hover:bg-gray-300 py-2 px-3 rounded-3xl">Annulla</button
								>
								<button
									disabled={textComment === ''}
									on:click={addComment}
									class="hover:bg-[#065fd4] bg-[#065ff9] text-white py-2 px-3 rounded-3xl disabled:opacity-50"
									>Commenta</button
								>
							</div>
						</div>
					</div>
				{:else}
					<button
						on:click={() => {
							goto('/login');
						}}
						class="flex items-center gap-2"
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

			<div class="comments-listn flex flex-col gap-5 mt-4">
				{#if comments}
					{#each comments as comment}
						<div
							on:focus={() => {}}
							on:mouseover={() => {
								if (comment.id === 'myid') {
									hover = true;
								}
							}}
							on:mouseleave={() => {
								if (comment.id === 'myid' && showMenuComment == false) {
									hover = false;
								}
							}}
							class="comment-cont flex gap-5"
						>
							<div class="user-thum shrink-0 w-12 h-12">
								{#if comment.snippet.topLevelComment.snippet?.authorProfileImageUrl == 'user'}
									<div
										class="rounded-full w-full h-full flex justify-center items-center bg-slate-400"
									>
										{comment.snippet.topLevelComment.snippet.authorDisplayName.charAt(0)}
									</div>
								{:else}
									<img
										class="rounded-full w-full"
										src={comment.snippet.topLevelComment.snippet?.authorProfileImageUrl}
										alt={comment.snippet.topLevelComment.snippet.authorDisplayName.charAt(0)}
									/>
								{/if}
							</div>

							<!-- comment-details -->
							{#if comment.id === 'myid'}
								<div class="w-full">
									<!-- ------------------------------------------ -->

									{#if modifyCommentBool}
										<div class="user-inner-comment flex items-start gap-4 bg-white w-full">
											<div class="w-full flex flex-col gap-2 relative">
												<input
													bind:value={textCommentModify}
													on:focus={() => {
														focusedModify = true;
													}}
													class="focus:outline-none border-b-[1px] w-full z-10"
													type="text"
													placeholder="Aggiungi un commento..."
												/>
												<div
													class="line absolute top-6 border-b-2 border-black origin-center transition-[.5s] w-full"
													style:transform={focusedModify ? 'scale(1)' : 'scale(0)'}
												/>
												<div
													style:height={focusedModify ? '100%' : '0'}
													class="buttons flex pt-2 justify-end gap-2 overflow-hidden"
												>
													<button
														on:click={() => {
															modifyCommentBool = false;
														}}
														class="hover:bg-gray-300 py-2 px-3 rounded-3xl"
														>Annulla
													</button>
													<button
														disabled={textCommentModify === ''}
														on:click={modifyComment}
														class="hover:bg-[#065fd4] bg-[#065ff9] text-white py-2 px-3 rounded-3xl disabled:opacity-50"
														>Salva
													</button>
												</div>
											</div>
										</div>
									{:else}
										<div class="comment-details flex flex-col gap-1">
											<p class="flex items-center gap-3">
												<span class="user font-bold"
													>{comment.snippet.topLevelComment.snippet.authorDisplayName}</span
												><span
													>{daysBetween(comment.snippet.topLevelComment.snippet.publishedAt)}</span
												>
											</p>
											<p contenteditable="false">
												{comment.snippet.topLevelComment.snippet.textOriginal}
											</p>
											<div class="buttons-like-unlike flex">
												<button class="like flex items-center gap-1" style:padding="5px"
													><Icon icon="mdi:like-outline" />{comment.snippet.topLevelComment.snippet
														.likeCount}</button
												>
												<button class="dislike px-2"><Icon icon="mdi:dislike-outline" /></button>
											</div>
										</div>
									{/if}
								</div>
							{:else}
								<div class="comment-details flex flex-col gap-1">
									<p class="flex items-center gap-3">
										<span class="user font-bold"
											>{comment.snippet.topLevelComment.snippet.authorDisplayName}</span
										><span>{daysBetween(comment.snippet.topLevelComment.snippet.publishedAt)}</span>
									</p>
									{#if comment.id === 'myid'}
										<p
											bind:innerHTML={comment.snippet.topLevelComment.snippet.textOriginal}
											contenteditable="true"
										/>
									{:else}
										<p contenteditable="false">
											{comment.snippet.topLevelComment.snippet.textOriginal}
										</p>
									{/if}
									<div class="buttons-like-unlike flex">
										<button class="like flex items-center gap-1" style:padding="5px"
											><Icon icon="mdi:like-outline" />{comment.snippet.topLevelComment.snippet
												.likeCount}</button
										>
										<button class="dislike px-2"><Icon icon="mdi:dislike-outline" /></button>
									</div>
								</div>
							{/if}

							{#if comment.id === 'myid' && hover && modifyCommentBool == false}
								<div class="ms-auto relative">
									<button
										on:click={() => {
											showMenuComment = !showMenuComment;
										}}
									>
										<Icon icon="mdi:dots-vertical" class="text-xl" />
									</button>
									<ul
										class="py-3 rounded-xl border absolute top-5 left-0 bg-white"
										style:display={showMenuComment ? 'block' : 'none'}
									>
										<li>
											<button
												on:click={() => {
													modifyCommentBool = true;
													showMenuComment = false;
												}}
												class="px-5 py-2 flex items-center gap-3 hover:bg-gray-400 w-full"
												><Icon
													icon="streamline:interface-edit-pencil-change-edit-modify-pencil-write-writing"
													class="text-xl"
												/><span>Modifica</span></button
											>
										</li>
										<li>
											<button
												on:click={deleteComment}
												class="px-5 py-2 flex items-center gap-3 hover:bg-gray-400 w-full"
												><Icon
													icon="material-symbols:delete-outline-rounded"
													class="text-xl"
												/><span>Elimina</span></button
											>
										</li>
									</ul>
								</div>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>

	<!-- right-bar-->
	<div class="basis-2/6 ps-[24px] flex flex-col gap-4 min-w-[300px]">
		{#if (prevPage && prevPage === '/likedVideo') || likedVideos.includes(video.id)}
			<!-- playlist video piaciuti  -->
			<div class="border p-5 rounded-xl max-h-[500px] overflow-y-scroll flex flex-col gap-4">
				<div>
					<h1 class="font-bold text-xl">Video piaciuti</h1>
					<p>
						<span>{$page.data.user.name} - </span>
						<span>{`${likedVideos.indexOf(video.id) + 1} / ${likedVideos.length}`}</span>
					</p>

					<div class="text-3xl">
						<button
							on:click={() => {
								if (likedVideos.indexOf(video.id) === 0) {
									goto(`/video/${likedVideos[likedVideos.length - 1]}`, {
										replaceState: true,
										invalidateAll: false
									});
								} else {
									goto(`/video/${likedVideos[likedVideos.indexOf(video.id) - 1]}`, {
										replaceState: true,
										invalidateAll: false
									});
								}
							}}><Icon icon="material-symbols:skip-previous-rounded" /></button
						>
						<button
							on:click={() => {
								if (likedVideos.indexOf(video.id) === likedVideos.length - 1) {
									goto(`/video/${likedVideos[0]}`, {
										replaceState: true,
										invalidateAll: false
									});
								} else {
									goto(`/video/${likedVideos[likedVideos.indexOf(video.id) + 1]}`, {
										replaceState: true,
										invalidateAll: false
									});
								}
							}}><Icon icon="material-symbols:skip-next-rounded" /></button
						>
					</div>
				</div>

				{#each likedVideosRes as likedVideo}
					<button
						on:click={() => {
							goto(`/video/${likedVideo.id}`, {
								replaceState: true,
								invalidateAll: false
							});
						}}
						class="text-start flex gap-2 text-black"
					>
						<div class="shrink-0 grow-0">
							<img
								class="object-cover aspect-video max-w-[128px] rounded-lg"
								src={likedVideo.snippet.thumbnails.standard.url}
								alt=""
							/>
						</div>
						<div>
							<h1
								class="font-semibold text-[14px] overflow-hidden w-full max-h-12 text-ellipsis line-clamp-2"
							>
								{likedVideo.snippet.title}
							</h1>
							<button
								on:click={(e) => {
									e.stopPropagation();
									goto(`/channel/${likedVideo.snippet.channelId}`, {
										noScroll: false
									});
								}}
								class="mt-2 text-left text-[12px] overflow-hidden w-full text-[#606060] text-ellipsis line-clamp-1"
							>
								{likedVideo.snippet.channelTitle}
							</button>
							<div class="flex gap-1 text-[12px] text-[#606060]">
								<span class="shrink-0"
									>{`${compactNumber(+likedVideo.statistics.viewCount)
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} visualizzazioni`}
								</span>
								<Icon icon="mdi:dot" />
								<span class="overflow-hidden w-full text-ellipsis line-clamp-1">
									{daysBetween(likedVideo.snippet.publishedAt)}
								</span>
							</div>
						</div>
					</button>
				{/each}
			</div>
		{/if}
		<!-- video correlati   -->
		<div class="flex flex-col gap-4">
			{#each relatedVideos as RelatedVideo}
				<button
					on:click={() => {
						goto(`/video/${RelatedVideo.id}`, {
							replaceState: true,
							invalidateAll: false
						});
					}}
					class="text-start flex gap-2 text-black"
				>
					<div class="shrink-0 grow-0">
						<img
							class="object-cover aspect-video max-w-[168px] rounded-lg"
							src={RelatedVideo.snippet.thumbnails.standard?.url}
							alt=""
						/>
					</div>
					<div>
						<h1
							class="font-semibold text-[14px] overflow-hidden w-full max-h-12 text-ellipsis line-clamp-2"
						>
							{RelatedVideo.snippet.title}
						</h1>
						<button
							on:click={(e) => {
								e.stopPropagation();
								goto(`/channel/${RelatedVideo.snippet.channelId}`, {
									replaceState: true
								});
							}}
							class="mt-2 text-left text-[12px] overflow-hidden w-full text-[#606060] text-ellipsis line-clamp-1"
						>
							{RelatedVideo.snippet.channelTitle}
						</button>
						<div class="flex gap-1 text-[12px] text-[#606060]">
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
