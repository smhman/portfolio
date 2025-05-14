<script>
	import { onMount } from 'svelte';
	let data = null;
	let expanded = true;

	onMount(async () => {
		const res = await fetch('https://notif-server.sundei.eu/notification');
		if (res.ok) {
			data = await res.json();
		}
	});
</script>

{#if data?.show}
	{#if expanded}
		<div class="public-notif-overlay" data-hidden="false">
			<div class="public-notif-wrapper-bg"></div>
			<div class="public-notif-wrapper">
				<div class="public-notif-container">
					<div class="public-notif-toggle" on:click={() => expanded = false}>
						<span class="public-notif-close">X</span>
					</div>
                        <div class="marquee-wrapper">
                            <marquee class="public-notif-text public-notif-marquee" scrollamount="5">
                                {data.textEt}
                            </marquee>
                        <div class="marquee-fade"></div>
                    </div>
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
	align-items: center;
	z-index: 2;
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
	background: transparent;
	transition: background 0.2s ease;
}

.public-notif-toggle span:hover {
	background: #9f0000;
	box-shadow: 0 0 5px #00000057;
}

.public-notif-container summary,
.public-notif-expansion summary {
	pointer-events: none;
	user-select: none;
	cursor: default;
}

.marquee-wrapper {
	position: relative;
	padding-right: 80px; /* Leave space for the X button */
	overflow: hidden;
}

.marquee-wrapper::after {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	width: 80px;
	height: 100%;
	background: linear-gradient(to left, #c40707 20%, transparent 100%);
	pointer-events: none;
	z-index: 1;
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
	z-index: 0;
}

.public-notif-text.expanded {
	height: auto;
	white-space: normal;
	cursor: default;
	font-size: 18px;
}

/* 🔔 Minimized Floating Button */
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