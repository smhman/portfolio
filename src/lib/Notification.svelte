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
                        <div class="marquee-inner">
                            <span>{data.textEt + '\xa0'.repeat(15)}</span>
                        </div>
                        <div class="marquee-fade"></div>
                    </div>
				</div> <!-- .public-notif-container -->
			</div> <!-- .public-notif-wrapper -->
		</div> <!-- .public-notif-overlay -->
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
	transition: none;
}

.public-notif-container {
	position: relative;
	display: block;
	max-width: 1400px;
	height: var(--public-notif-wrapper-height);
	margin: 0 auto;
	background-color: #c40707;
	border-radius: 6px;
	overflow: hidden; /* CRITICAL: clips fade and keeps corners clean */
	pointer-events: all;
}

.public-notif-toggle {
	position: absolute;
	top: 0;
	right: 0;
	width: var(--public-notif-wrapper-height);
	height: var(--public-notif-wrapper-height);
	display: flex;
	align-items: center;
	justify-content: center; /* center both axes */
	z-index: 2;
	cursor: pointer;
}

.public-notif-toggle span {
	display: flex;
	justify-content: center;
	align-items: center;
	width: var(--public-notif-toggle-span-size);
	height: var(--public-notif-toggle-span-size);
	color: #fff;
	font-size: var(--public-notif-toggle-span-font-size);
	font-weight: 500;
	border: 1px solid #ffffff75;
	border-radius: 50%;
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
	overflow: hidden;
	height: var(--public-notif-wrapper-height);
	display: flex;
	align-items: center;
	padding-left: 20px;
	padding-right: 80px;
	box-sizing: border-box;
}

.marquee-inner {
	display: inline-block;
	white-space: nowrap;
	animation: scroll-pause-loop 21s linear infinite;
	min-width: 100%; /* ensures it starts offscreen */
}

.marquee-inner span {
    font-size: 26px;
    color: white;
	font-weight: 500;
	display: inline-block;
	padding-right: 100%; /* makes the scroll loop smooth */
}

.marquee-inner .ghost {
	opacity: 0.5;
}
@keyframes scroll-pause-loop {
	0% {
		transform: translateX(100%);
	}
	90% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(-100%); /* pause here */
	}
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
/* ✅ Modern CSS marquee replacement */
.marquee-text {
	display: flex;
	align-items: center;
	white-space: nowrap;
	will-change: transform;
    animation: scroll-pause-loop 12s linear infinite;
	font-size: 26px;
	color: white;
	font-weight: 500;
	padding-left: 100%;  /* Wait before entering */
	padding-right: 80px; /* Wait before restarting */
}

.marquee-text span {
	display: inline-block;
	padding-right: 100%; /* Give it room to loop */
}

/* Fade gradient to match design */
.marquee-fade {
	position: absolute;
	right: 0;
	top: 0;
	width: 80px;
	height: 100%;
	background: linear-gradient(to left, #c40707 0%, transparent 100%);
	pointer-events: none;
	z-index: 1;
    border-top-right-radius: 6px; /* Match container */
    border-bottom-right-radius: 6px;
}

.notif-floater:hover {
	transform: scale(1.05);
}
</style>