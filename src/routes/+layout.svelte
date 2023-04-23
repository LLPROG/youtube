<script lang="ts">
	import '../app.css';
	import Navbar from '$components/navbar/+page.svelte';
	import Sidebar from '$components/sidebar/+page.svelte';
	import { page } from '$app/stores';
	import { beforeNavigate } from '$app/navigation';

	$: login = $page.data.user;

	$: showSid = true; // check if the sidebar, NOT in video section, is visible or not
	$: visible = false; // check if the sidebar, in the video section, is visible or not

	// function for showing sidebar dispatched from navbar component
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

	beforeNavigate(() => {
		visible = false;
	});
</script>

{#if !$page.url.pathname.startsWith('/login')}
	<div class="relative">
		<div class="w-full fixed right-[14px] bg-white ps-5">
			<Navbar on:showSidebar={showSidebar} />
		</div>

		<!-- fixed sidebar for video section -->
		{#if $page.url.pathname.startsWith('/video')}
			<div
				class="sidebar-video h-[100vh] bg-white pt-1 fixed top-0 z-50"
				style:left={visible ? '0px' : '-250px'}
			>
				<Sidebar showSidebarVideo={visible} on:showSidebarVideoFunction={showSidebar} />
			</div>
		{/if}
		<!-- end -->

		<div class="flex pt-14">
			{#if !$page.url.pathname.startsWith('/video')}
				<!-- regular sidebar + slot -->
				<div class="w-fit fixed bg-white">
					<Sidebar showSidebar={showSid} />
				</div>

				<div style:padding-left={showSid ? '240px' : '80px'} class="w-full">
					<slot />
				</div>
				<!-- end -->
			{:else}
				<!-- slot for video section -->
				<div class="w-full">
					<slot />
				</div>
				<!-- end -->
			{/if}
		</div>
	</div>
{:else}
	<!-- case for login page -->
	<div class="flex justify-center items-center h-[100vh]">
		<div class="border rounded-lg p-10">
			<slot />
		</div>
	</div>
	<!-- end -->
{/if}

<style>
	.sidebar-video {
		transition: 0.5s;
	}
</style>
