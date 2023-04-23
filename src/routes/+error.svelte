<script lang="ts">
	// import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<div class="pt-10 w-full flex flex-col items-center">
	<h1>{$page.error?.message} - {$page.status}</h1>

	{#if $page.status === 400}
		<p>La pagina non puo essere trovata</p>
	{/if}

	{#if $page.status === 500}
		<p>La pagina non riesce ad accedere al server.</p>
	{/if}
</div>

<style lang="scss">
</style>
