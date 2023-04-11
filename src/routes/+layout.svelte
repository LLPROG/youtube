<script lang="ts">
	import '../app.css';
	import Navbar from '$components/navbar/+page.svelte';
	import Sidebar from '$components/sidebar/+page.svelte';
	import { page } from '$app/stores';

	$: login = $page.data.user;

	// console.log($page.url.pathname.startsWith('/video'));
	$: showSid = true;
	$: visible = false;
	const showSidebar = () => {
		if ($page.url.pathname.startsWith('/video')) {
			visible = !visible;
			if (visible) {
				document.body.classList.add('hide-scroll');
			} else {
				document.body.classList.remove('hide-scroll');
			}
		} else {
			showSid = !showSid;
		}
	};
</script>

{#if !$page.url.pathname.startsWith('/login')}
	<div class="relative">
		<div class="fixed w-full bg-white ps-5 right-[14px]">
			<Navbar on:showSidebar={showSidebar} />
		</div>
		{#if $page.url.pathname.startsWith('/video')}
			<div
				class="sidebar-video pt-1 absolute top-0 h-[100vh] bg-white z-10"
				style:left={visible ? '0px' : '-250px'}
			>
				<Sidebar on:showSidebarVideo={showSidebar} showSidebarVideo={visible} />
			</div>
		{/if}

		<div class="flex pt-14">
			{#if !$page.url.pathname.startsWith('/video')}
				<div class="fixed w-fit bg-white">
					<Sidebar showSidebar={showSid} />
				</div>

				<div style:padding-left={showSid ? '220px' : '18px'} class="w-full">
					<slot />
				</div>
			{:else}
				<div class="w-full">
					<slot />
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="flex justify-center items-center h-[100vh]">
		<div class="border rounded-lg p-10">
			<slot />
		</div>
	</div>
{/if}

<style>
	.sidebar-video {
		transition: 0.5s;
	}
</style>
