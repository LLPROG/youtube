<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	$: console.log(form);
</script>

<h1 class="text-center text-2xl">Inserisci le tue credenziali</h1>

<form method="POST" action="?/login" use:enhance class="flex flex-col gap-3 items-start pt-5">
	<div class="flex items-center">
		<label for="username" class="w-24">Username</label>
		<input
			class="p-1 rounded-md"
			id="username"
			name="username"
			placeholder="Username"
			value={form?.username || ''}
		/>
	</div>

	{#if form?.usernameMissing}
		<p style:color="red">username is required</p>
		<br />
	{/if}

	<div class="flex items-center">
		<label for="password" class="w-24">Password</label>
		<input
			class="p-1 rounded-md"
			id="password"
			name="password"
			placeholder="Password"
			type="password"
		/>
	</div>

	{#if form?.passwordMissing}
		<p style:color="red">password is required</p>
		<br />
	{/if}

	<button class="text-[#065fd4]" type="submit">Submit</button>
</form>
