<script lang="ts">
	import Icon from '@iconify/svelte';
	import { compactNumber } from '$lib/global functions/compactNumer';
	import type { PageData } from './$types';
	export let data: PageData;
	$: about = data.community.items[0].about;
	$: channel = data.channel.items[0];
	$: console.log(channel);

	// italian date formatter funcion
	const italianTimeFormat = (dateUTC: Date) => {
		const monthNames = [
			'Gennaio',
			'Febbraio',
			'Marzo',
			'Aprile',
			'Maggio',
			'Giugno',
			'Luglio',
			'Agoost',
			'Settembre',
			'Ottobre',
			'Novembre',
			'Dicembre'
		];
		if (dateUTC) {
			let jsDateFormat = new Date(dateUTC);
			let fullStringTime = {
				day: Number(jsDateFormat.getDate() < 10)
					? '0' + jsDateFormat.getDate()
					: jsDateFormat.getDate(),
				month:
					Number(jsDateFormat.getMonth() + 1) < 10
						? '0' + (jsDateFormat.getMonth() + 1)
						: jsDateFormat.getMonth() + 1,
				year: jsDateFormat.getFullYear()
			};
			return (
				fullStringTime.day +
				' ' +
				monthNames[+fullStringTime.month] +
				' ' +
				fullStringTime.year +
				' '
			);
		}
		return null;
	};
</script>

<div class="about flex px-20 pt-10">
	<!-- info about -->
	<div class="info-section basis-3/4 flex flex-col gap-3 pe-40">
		<!-- descrizione -->
		<section class="desc border-b-2 pb-5">
			<h2 class="py-5 text-[16px]">Descrizione</h2>
			<p class="text-[14px]">{about.description}</p>
		</section>

		<!-- dettagli -->
		<section class="details border-b-2 pb-5">
			<h2 class="py-5 text-[16px]">Dettagli</h2>
			<p class="text-[14px] flex items-center gap-3">
				<span>Localita:</span>{about.details.location}<span />
			</p>
		</section>

		<!-- links -->
		<div class="links pb-3">
			<h2 class="py-5 text-[16px]">Link</h2>
			<ul class="text-[14px] grid grid-cols-2 gap-4">
				{#each about.links as link}
					<li>
						<a class="text-blue-500" href={link.url}>{link.title}</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- statistics -->
	<div class="statistics basis-1/4">
		<h3 class="py-5 text-[16px] border-b-2">Statistiche</h3>
		<p class="py-3 text-[16px] border-b-2">
			<span>Data iscrizione:</span><span>{italianTimeFormat(channel.snippet.publishedAt)}</span>
		</p>
		<p class="py-3 text-[16px] border-b-2">
			{compactNumber(about.stats.viewCount)} visualizzazioni
		</p>
		<button class="py-3 text-[20px]"><Icon icon="material-symbols:flag-outline" /></button>
	</div>
</div>
