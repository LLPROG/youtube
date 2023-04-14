<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: channel = data.channel.items[0];
	$: posts = data.community.items[0].community;
	$: console.log(posts.length);
</script>

<div class="flex flex-col gap-4 px-20 pt-10">
	{#if posts.length == 0}
		<div class="w-full p-10 text-center">
			<p>Non é presente alcun post</p>
		</div>
	{:else}
		{#each posts as post}
			<div class="p-3 flex gap-3 border rounded-xl">
				<!-- thumb -->
				<div class="thumb shrink-0 w-[40px] ">
					<img src={channel.snippet.thumbnails.default.url} alt="" class="w-100% rounded-full" />
				</div>

				<!-- info card -->
				<div>
					<h1 class="font-semibold text-sm flex items-center gap-2 py-2">
						<span>{channel.snippet.title}</span>
						<span class="text-[#606060]">{post.date}</span>
					</h1>
					<p>
						{#each post.contentText as text}
							{#if text.url}
								<a href={text.url}>{text.text}</a>
							{:else}
								<span>{text.text}</span>
							{/if}
						{/each}
					</p>
					{#if post.images.length > 0}
						<div class="mt-2">
							<img class="rounded-xl w-[650px]" src={post.images[0].thumbnails[0].url} alt="" />
						</div>
					{/if}

					<div class="flex items-center gap-2 text-xl py-4">
						<button class="like flex items-center gap-2"
							><Icon icon="mdi:like-outline" /><span class="text-sm">{post.likes}</span></button
						>
						<button><Icon icon="mdi:dislike-outline" /></button>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>
