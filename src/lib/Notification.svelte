<script>
	import { onMount } from 'svelte';
	let data = null;

	onMount(async () => {
		const res = await fetch('https://notif-server.sundei.eu/notification');
		if (res.ok) {
			data = await res.json();
		}
	});
</script>

{#if data?.show}
<div class="public-notif-overlay" data-hidden={data ? 'false' : 'true'}>
	<div class="public-notif-wrapper-bg"></div>
	<div class="public-notif-wrapper">
		<details class="public-notif-container" open>
			<summary class="public-notif-toggle" aria-label="Ava/sulge" title="Ava/sulge">
			</summary>
			<details class="public-notif-expansion">
				<summary aria-label="Laienda/kitsenda" title="Laienda/kitsenda">
					<marquee class="public-notif-text public-notif-marquee" scrollamount="5">
						{data.textEt}
					</marquee>
				</summary>
				<p class="public-notif-text expanded">
					{data.textEt}
				</p>
			</details>
		</details>
	</div>
</div>
{/if}

<style>
	:root {
		--public-notif-wrapper-height: 70px;
		--public-notif-wrapper-margin: 20px;
		--public-notif-toggle-span-size: 33px;
		--public-notif-toggle-span-margin: calc((var(--public-notif-wrapper-height) - var(--public-notif-toggle-span-size)) / 2);
		--public-notif-toggle-span-font-size: 21px;
		--100vh: 100vh;
	}

	.public-notif-overlay {
		z-index: 10000;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.public-notif-overlay[data-hidden="true"] {
		z-index: -10000;
		opacity: 0;
	}

	.public-notif-wrapper {
		position: absolute;
		width: calc(100% - (var(--public-notif-wrapper-margin) * 2));
		height: var(--public-notif-wrapper-height);
		margin: var(--public-notif-wrapper-margin);
		transition: max-width 0.3s, transform 0.3s;
	}

	.public-notif-wrapper-bg {
		position: fixed;
		width: 105%;
		min-width: 1400px;
		height: 120px;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0.05) 90%, rgba(0, 0, 0, 0) 100%),
			radial-gradient(farthest-side at 45% -10px, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0.1) 90%, rgba(0, 0, 0, 0) 100%);
		opacity: 1;
		pointer-events: all;
		transition: all 0.2s 0.3s;
	}

	.public-notif-container {
		position: relative;
		display: block;
		max-width: 1400px;
		height: var(--public-notif-wrapper-height);
		margin: 0 auto;
		background-color: #c40707;
		border-radius: 6px;
		overflow: visible;
		pointer-events: all;
	}

	.public-notif-toggle {
		position: absolute;
		top: 0;
		right: 0;
		width: var(--public-notif-wrapper-height);
		height: var(--public-notif-wrapper-height);
		display: flex;
		justify-content: flex-end;
		z-index: 1;
		cursor: pointer;
	}

	.public-notif-toggle span {
		display: flex;
		justify-content: center;
		align-items: center;
		width: var(--public-notif-toggle-span-size);
		height: var(--public-notif-toggle-span-size);
		margin-top: var(--public-notif-toggle-span-margin);
		margin-right: var(--public-notif-toggle-span-margin);
		color: #fff;
		font-size: var(--public-notif-toggle-span-font-size);
		font-weight: 500;
		border: 1px solid #ffffff75;
		border-radius: 50%;
		text-align: center;
		cursor: pointer;
	}

	.public-notif-toggle span:hover {
		background: #9f0000;
		box-shadow: 0 0 5px #00000057;
	}

	.public-notif-toggle .public-notif-close {
		display: none;
	}
	.public-notif-container:not([open]) .public-notif-toggle .public-notif-close {
		display: flex;
	}
	.public-notif-container[open] .public-notif-toggle .public-notif-open {
		display: none;
	}

	.public-notif-expansion summary {
		height: var(--public-notif-wrapper-height);
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.public-notif-text {
		position: relative;
		margin: 0 clamp(5px, 2%, 15px);
		padding: clamp(5px, 2%, 15px) 0;
		color: #fff;
		font-size: 26px;
		display: flex;
		align-items: center;
		font-weight: 500;
		white-space: nowrap;
		cursor: pointer;
	}

	.public-notif-text.expanded {
		height: auto;
		white-space: normal;
		cursor: default;
		font-size: 18px;
	}
</style>
