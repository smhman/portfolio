<script lang="ts">
	import { onMount } from 'svelte';
	import type { NowPlayingResponse } from '$lib/types';
	import { fastNow } from '$lib/stores';

	import MusicalNote from '$lib/components/icons/MusicalNote.svelte';
	import Pause from '$lib/components/icons/Pause.svelte';
	import Play from '$lib/components/icons/Play.svelte';

	let data: NowPlayingResponse | undefined;
	let lastFetched = 0;

	const localTrackLinks: Record<string, string> = {
		"Make It Shine (Victorious Theme)": "https://open.spotify.com/track/4M7PM1oAb4FaYIu5wiVnCJ",
		"Freak The Freak Out": "https://open.spotify.com/track/5q4uMmYpzS0zduoBoSPKsU",
		"Best Friend's Brother": "https://open.spotify.com/track/0VRh0HgB1RsgqjH7YswsJK",
		"Beggin' On Your Knees": "https://open.spotify.com/track/2jXxUK7a6zVPStFSCZqe4G",
		"All I Want Is Everything": "https://open.spotify.com/track/6wtevpyGfiHMwaTltoTcWH",
		"You're The Reason": "https://open.spotify.com/track/4k4AibHwZjJ41bXu7ToVSP",
		"Give It Up": "https://open.spotify.com/track/4sqQci4nqA37mA5tcHJnfo",
		"I Want You Back": "https://open.spotify.com/track/7cPInqSwBq0nV0PINEs89X",
		"Song 2 You": "https://open.spotify.com/track/5o3JbTRMCdrMI7xxt35KyQ",
		"Tell Me That You Love Me": "https://open.spotify.com/track/03gp1uTgpOdCxjDCXr3saU",
		"Finally Falling": "https://open.spotify.com/track/41eaRFYMRvdP9WYXLmfU6m",
		"Leave It All To Shine": "https://open.spotify.com/track/6nmuXal0nsHT8T4y9MXHjC",
		"Broken Glass": "https://open.spotify.com/track/3fJ2qEr2yGOPoZG3o84VIp",
		"Make It In America": "https://open.spotify.com/track/6gfAQs9TWAq91Ehp3eLFUX",
		"Take A Hint": "https://open.spotify.com/track/1T20tqHKrePjszGOdbFOEd",
		"Shut Up And Dance": "https://open.spotify.com/track/3myg6Gpulo6fD0EOnz5dOQ",
		"5 Fingaz to the Face": "https://open.spotify.com/track/4TNYEycAT9vJw0yWl3oVab",
		"Countdown": "https://open.spotify.com/track/5FBnmSW9mKMFIT4yg7pnub",
		"Don't You (Forget About Me)": "https://open.spotify.com/track/2Z5FipHH2FebcDQyPBRFkm",
		"Here's 2 Us (feat. Victoria Justice)": "https://open.spotify.com/track/3n5TN5s5NFWatzrsFmQOse",
		"L.A. Boyz (feat. Victoria Justice & Ariana Grande)": "https://open.spotify.com/track/2cOpRVjsE4qZLZbFOB47VJ",
		"Bad Boys (feat. Victoria Justice)": "https://open.spotify.com/track/2MdS9zhalwAJURsVaaNm2J",
		"You Don't Know Me (feat. Elizabeth Gillies)": "https://open.spotify.com/track/6mSL6E1oxowyr3qknFAHTm",
		"Faster than Boyz (feat. Victoria Justice)": "https://open.spotify.com/track/0powdVQEIZSaSnNupt2yPE"
	};
	
	// CDN albumikaante map
	const localAlbumCovers: Record<string, string> = {
		"Victorious 3.0: Even More Music From The Hit TV Show":
			"https://cdn.sundei.eu/art/victorious-3.jpg",
		"Victorious 2.0: More Music From The Hit TV Show":
			"https://cdn.sundei.eu/art/victorious-2.jpg",
		"Victorious: Music From The Hit TV Show":
			"https://cdn.sundei.eu/art/victorious-1.jpg"
	};

	// Valib sobiva kaane, kui lugu on lokaalne
	$: localCover =
		data?.track?.is_local && data.track.album.name
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
	const localArtistLinks: Record<string, string> = {
		"Victoria Justice": "https://open.spotify.com/artist/2OTfr6S2kuHRYStjt1IkY6",
		"Ariana Grande": "https://open.spotify.com/artist/66CXWjxzNUsdJxJ2JdwvnR",
		"Leon Thomas III": "https://open.spotify.com/artist/5Z3CI4r6K4WAtl1O1id3HJ",
		"Elizabeth Gillies": "https://open.spotify.com/artist/0tnLXvm7c6ozq46x6qzgvL",
		"Matt Bennett": "https://open.spotify.com/artist/0D9NxxLyD8hXkZQM1WXoWU",
		"Victorious Cast": "https://open.spotify.com/artist/1KYszkVzlhV3rAqmAcYIgd"
	};
	$: artistsList = data?.track?.artists?.length === 1
		? data.track.artists[0].name.split(";").map(a => a.trim())
		: data?.track?.artists?.map(a => a.name) || [];
	function getTrackLink(trackName: string): string {
		const normalizedName = trackName.trim().toLowerCase();

		for (const key in localTrackLinks) {
			if (key.toLowerCase() === normalizedName) {
			return localTrackLinks[key];
			}
		}
		// Kui linki ei leia, siis tagasta Spotify ametlik link
		return data.track.external_urls.spotify;
	}
	function clamp(t: number) {
		return Math.max(Math.min(t, 1), 0);
	}

	$: progress = data?.track
		? clamp(
				(data.progessMs + ($fastNow.getTime() - lastFetched)) /
					data.track.duration_ms
			)
		: 0;
</script>

<div class="mt-4 flex rounded-full items-center bg-gray-900">
	{#if localCover}
		<img
			src={localCover}
			alt="Local Album Art"
			class="w-20 h-20 rounded-xl shrink-0 bg-gray-800 text-gray-400 object-cover"
		/>
	{:else if data?.track?.album.images[0]?.url}
		<img
			src={data.track.album.images[0].url}
			alt="Album Art"
			class="w-20 h-20 rounded-xl shrink-0 bg-gray-800 text-gray-400 object-cover"
		/>
	{:else}
		<div
			class="w-20 h-20 rounded-xl shrink-0 bg-gray-800 text-gray-400 grid place-items-center"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6"
			>
				<path
					fill-rule="evenodd"
					d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017 5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
	{/if}

	<div class="pl-4 py-2 pr-4 relative">
		<p class="line-clamp-1 break-all text-gray-400">
			{#if data?.track}
				<a
					href={getTrackLink(data.track.name)}
					target="_blank"
					rel="noopener noreferrer"
					class="mr-1 text-white font-semibold border-b border-transparent transition hv:border-current"
				>
					{data.track.name}
				</a>

				{#each artistsList as artist, i}
					<a
						href={localArtistLinks[artist] || "#"}
						target="_blank"
						rel="noopener noreferrer"
						class="border-b border-transparent transition hv:border-current"
					>
						{artist}{i < artistsList.length - 1 ? "," : ""}
					</a>{i < artistsList.length - 1 ? " " : ""}
				{/each}
			{:else}
				Not Listening to Anything
			{/if}
		</p>

		<p class="flex items-center gap-1 text-sm text-gray-400">
			<span class="shrink-0">
				<MusicalNote />
			</span>

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
		<div
			class="ml-auto shrink-0 w-12 h-12 mr-4 rounded-full progress"
			style:--progress={progress}
		>
			<div
				class="w-10 h-10 rounded-full bg-gray-900 mt-1 ml-1 grid place-items-center text-gray-400"
			>
				{#if data.isPaused}
					<Play />
				{:else}
					<Pause />
				{/if}
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
