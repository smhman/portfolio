<script lang="ts">
	import { onMount } from 'svelte';
	import type { NowPlayingResponse } from '$lib/types';
	import MusicalNote from '$lib/components/icons/MusicalNote.svelte';
	import Pause from '$lib/components/icons/Pause.svelte';
	import Play from '$lib/components/icons/Play.svelte';
    import { lastAppleMusic } from '$lib/stores';
    import { get } from 'svelte/store';

	let data: NowPlayingResponse | null = null;
	let lastFetched = 0;

	onMount(() => {
		load();
		const id = setInterval(load, 3000); // 3s instead of 1s for efficiency
		return () => clearInterval(id);
	});

	async function load() {
		try {
			const res = await fetch('/api/now-playing/cider', { cache: 'no-store' });

			if (res.ok) {
				const fresh = await res.json();
				data = fresh;

				// Optionally save to Redis
				await fetch('/api/now-playing/cider/save', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(fresh)
				});
			} else if (res.status === 204 || res.status === 500) {
				// Fallback if no data or internal server error
				const fallback = await fetch('/api/now-playing/cider/last');
				if (fallback.ok) {
					const cached = await fallback.json();
					cached.isPlayingNow = false;
					data = cached;
				} else {
					data = null;
				}
			} else {
				// Other unexpected responses
				console.warn('Unhandled response status:', res.status);
				data = null;
			}
			lastFetched = Date.now();
		} catch (err) {
			console.error('Failed to load now playing:', err);
			data = null;
		}
	}

    function clamp(t: number) {
	    return Math.max(Math.min(t, 1), 0);
    }

    $: progress = data?.track
    ? clamp(
        (data.progressMs + (Date.now() - lastFetched)) / data.track.duration_ms
        )
    : 0;

</script>

{#if data}
<div class="mt-4 flex rounded-full items-center bg-gray-900">
    <img
    src={data.track.album.images[0]?.url}
    alt="Album Art"
    class="w-20 h-20 rounded-xl shrink-0 bg-gray-800 text-gray-400 object-cover"
    />

	<div class="pl-4 py-2 pr-4 relative">
		<p class="line-clamp-1 break-all text-gray-400">
            <a
                href={data.track.external_urls.apple}
				target="_blank"
				class="mr-1 text-white font-semibold border-b border-transparent hover:border-current"
			>
				{data.track.name}
			</a>
			{#each data.track.artists as artist, i}
				<span class="text-gray-400">
					{artist.name}{i < data.track.artists.length - 1 ? ',' : ''}
				</span>
			{/each}
		</p>

		<p class="flex items-center gap-1 text-sm text-gray-400">
			<MusicalNote />
			<span>
                {#if data.isPlayingNow}
                    Listening Now (Apple Music)
                {:else if data}
                    Last Played on Apple Music
                {:else}
                    Not Listening
                {/if}
            </span>
		</p>
	</div>

	{#if data.isPlayingNow}
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
{/if}

<style>
	.progress {
		background: conic-gradient(
			#4b5563 calc(var(--progress) * 100%),
			#1f2937 0
		);
	}
</style>
