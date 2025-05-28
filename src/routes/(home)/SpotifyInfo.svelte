<script lang="ts">
	import { onMount } from 'svelte';
	import type { NowPlayingResponse } from '$lib/types';
	import { fastNow } from '$lib/stores';
	import MusicalNote from '$lib/components/icons/MusicalNote.svelte';
	import Pause from '$lib/components/icons/Pause.svelte';
	import Play from '$lib/components/icons/Play.svelte';

	let data: NowPlayingResponse | undefined;
	let lastFetched = 0;

	// Local track links
	const localTrackLinks: Record<string, string> = {
		"Faster than Boyz": "https://open.spotify.com/track/0powdVQEIZSaSnNupt2yPE?si=bfed3a9224cb458a",
		// Add more local tracks here
	};

	// Local album covers
	const localAlbumCovers: Record<string, string> = {
		"Victorious 3.0: Even More Music From The Hit TV Show": "https://cdn.sundei.eu/art/victorious-3.jpg",
		"Victorious 2.0: More Music From The Hit TV Show": "https://cdn.sundei.eu/art/victorious-2.jpg",
		"Victorious: Music From The Hit TV Show": "https://cdn.sundei.eu/art/victorious-1.jpg"
	};

	// Custom artist URLs
	const customArtistLinks: Record<string, string> = {
		"Victoria Justice": "https://open.spotify.com/artist/2OTfr6S2kuHRYStjt1IkY6",
		"Ariana Grande": "https://open.spotify.com/artist/66CXWjxzNUsdJxJ2JdwvnR",
		"Leon Thomas III": "https://open.spotify.com/artist/5Z3CI4r6K4WAtl1O1id3HJ",
		"Elizabeth Gillies": "https://open.spotify.com/artist/0tnLXvm7c6ozq46x6qzgvL",
		"Matt Bennett": "https://open.spotify.com/artist/0D9NxxLyD8hXkZQM1WXoWU",
		"Victorious Cast": "https://open.spotify.com/artist/1KYszkVzlhV3rAqmAcYIgd"
	};

	// Process artists - separates combined artists and applies custom links
	function processArtists(artists: Array<{name: string, external_urls: {spotify: string}}>) {
		return artists.flatMap(artist => {
			if (artist.name.includes(';')) {
				return artist.name.split(';').map(name => ({
					name: name.trim(),
					external_urls: {
						spotify: customArtistLinks[name.trim()] || artist.external_urls.spotify
					}
				}));
			}
			return [{
				...artist,
				external_urls: {
					spotify: customArtistLinks[artist.name] || artist.external_urls.spotify
				}
			}];
		});
	}

	$: localCover = data?.track?.is_local && data.track.album.name
		? localAlbumCovers[data.track.album.name]
		: null;

	onMount(() => {
		fetchNowPlaying();
		const id = setInterval(() => fetchNowPlaying(), 5000);
		return () => clearInterval(id);
	});

	function fetchNowPlaying() {
		fetch('/api/now-playing')
			.then(res => res.json())
			.then(res => {
				data = res;
				lastFetched = Date.now();
			});
	}

	$: progress = data?.track
		? Math.max(Math.min((data.progressMs + ($fastNow.getTime() - lastFetched)) / data.track.duration_ms, 1), 0)
		: 0;
</script>

<div class="mt-4 flex rounded-full items-center bg-gray-900">
	<!-- Album Art Display (unchanged) -->
	{#if localCover}
		<img src={localCover} alt="Local Album Art" class="w-20 h-20 rounded-xl shrink-0 bg-gray-800 text-gray-400 object-cover" />
	{:else if data?.track?.album.images[0]?.url}
		<img src={data.track.album.images[0].url} alt="Album Art" class="w-20 h-20 rounded-xl shrink-0 bg-gray-800 text-gray-400 object-cover" />
	{:else}
		<div class="w-20 h-20 rounded-xl shrink-0 bg-gray-800 text-gray-400 grid place-items-center">
			<MusicalNote />
		</div>
	{/if}

	<div class="pl-4 py-2 pr-4 relative">
		<p class="line-clamp-1 break-all text-gray-400">
			{#if data?.track}
				<!-- Track name with local/online link -->
				<a
					href={data.track.is_local ? (localTrackLinks[data.track.name] || '#') : data.track.external_urls.spotify}
					target="_blank"
					rel="noopener noreferrer"
					class="mr-1 text-white font-semibold border-b border-transparent transition hv:border-current"
				>
					{data.track.name}
				</a>

				<!-- Processed artists list -->
				{#each processArtists(data.track.artists) as artist, i (i)}
					{#if i !== 0}, {/if}
					<a
						href={artist.external_urls.spotify}
						target="_blank"
						rel="noopener noreferrer"
						class="border-b border-transparent transition hv:border-current"
					>
						{artist.name}
					</a>
				{/each}
			{:else}
				Not Listening to Anything
			{/if}
		</p>

		<p class="flex items-center gap-1 text-sm text-gray-400">
			<span class="shrink-0"><MusicalNote /></span>
			<span class="line-clamp-1 break-all">
				{#if data?.isPlayingNow}
					Listening Now
				{:else if data?.track}
					Last Played on Spotify
				{:else}
					Spotify
				{/if}
			</span>
		</p>
	</div>

	{#if data?.isPlayingNow}
		<div class="ml-auto shrink-0 w-12 h-12 mr-4 rounded-full progress" style:--progress={progress}>
			<div class="w-10 h-10 rounded-full bg-gray-900 mt-1 ml-1 grid place-items-center text-gray-400">
				{#if data.isPaused}<Play />{:else}<Pause />{/if}
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.progress {
		background: conic-gradient(
			theme('colors.gray.700') calc(var(--progress) * 100%),
			theme('colors.gray.800') 0
		);
	}
</style>