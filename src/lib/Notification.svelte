<script>
	import { onMount } from 'svelte';

	let data = null;
	let expanded = true; // starts open — set to false if you want it to start minimized

	onMount(async () => {
		try {
			const res = await fetch('https://notif-server.sundei.eu/notification');
			if (res.ok) {
				data = await res.json();
			}
		} catch (err) {
			console.error('Notification fetch failed:', err);
		}
	});
</script>

{#if data?.show}
	{#if expanded}
		<div class="public-notif-overlay">
			<div class="public-notif-wrapper">
				<div class="public-notif-container">
					<div class="public-notif-toggle" on:click={() => expanded = false} title="Close">
						✕
					</div>
					<marquee class="public-notif-text public-notif-marquee" scrollamount="5">
						{data.textEt}
					</marquee>
					<p class="public-notif-text expanded">{data.textEt}</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="notif-floater" on:click={() => expanded = true} title="Open warning">
			<span>!</span>
		</div>
	{/if}
{/if}

<style>
	:global(body) {
		margin: 0;
	}

	.public-notif-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		pointer-events: none;
		z-index: 10000;
		display: flex;
		justify-content: center;
		padding: 1rem;
	}

	.public-notif-wrapper {
		width: 100%;
		max-width: 1400px;
		pointer-events: all;
	}

	.public-notif-container {
		background: #c40707;
		color: white;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
		position: relative;
		overflow: hidden;
	}

	.public-notif-toggle {
		position: absolute;
		top: 10px;
		right: 10px;
		cursor: pointer;
		font-size: 1.2rem;
		color: white;
		background: rgba(255, 255, 255, 0.15);
		border-radius: 50%;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s ease;
	}

	.public-notif-toggle:hover {
		background: rgba(255, 255, 255, 0.25);
	}

	.public-notif-text {
		font-size: 1.2rem;
		margin: 0.5rem 0 0;
	}

	.public-notif-text.expanded {
		font-size: 1rem;
		margin-top: 1rem;
		white-space: normal;
	}

	.notif-floater {
		position: fixed;
		bottom: 20px;
		left: 20px;
		width: 60px;
		height: 60px;
		background: #c40707;
		color: white;
		border-radius: 16px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 2rem;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
		cursor: pointer;
		z-index: 10001;
		transition: transform 0.2s ease;
	}

	.notif-floater:hover {
		transform: scale(1.05);
	}
</style>
