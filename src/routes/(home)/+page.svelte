<script lang="ts">
	import Clock from './Clock.svelte';
	import DiscordInfo from './DiscordInfo.svelte';
	import DiscordInfo2 from './DiscordInfo2.svelte';
	import SocialLink from './SocialLink.svelte';
	import SpotifyInfo from './SpotifyInfo.svelte';
	import Weather from './Weather.svelte';

	import GitHub from '$lib/components/icons/GitHub.svelte';
	import Envelope from '$lib/components/icons/Envelope.svelte';
	import Linkedin from '$lib/components/icons/Linkedin.svelte';
	import Spotify from '$lib/components/icons/Spotify.svelte';
	import Twitter from '$lib/components/icons/Twitter.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import { Analytics } from '@vercel/analytics/react';
</script>

<Meta title="sundei" description="My portfolio and personal website." />

<main class="wrapper fade">
	<h1 class="header">sundei</h1>

	<p class="mt-4 text-gray-400">
		Hey! I'm <b>sundei</b>, an 18-year old programmer from
		<b><span class="text-teal-400">Tartu, Estonia</span></b>. I'm studying in <span class="text-lime-400"><b>Tartu Vocational College</b></span> to be an IT-specialist.
	</p>

	<div class="mt-4 flex gap-6">
		<SocialLink href="https://github.com/smhman" name="GitHub">
			<GitHub />
		</SocialLink>

		<SocialLink
			href="https://www.linkedin.com/in/sundei"
			name="LinkedIn"
		>
			<Linkedin />
		</SocialLink>

		<SocialLink href="https://x.com/kurvaduudised" name="Twitter">
			<Twitter />
		</SocialLink>

		<SocialLink
			href="https://open.spotify.com/user/31deipyvl6evzmqhzuy6xg5qpima"
			name="Spotify"
		>
			<Spotify />
		</SocialLink>

		<SocialLink href="mailto:sundei@sundei.ee" name="Email">
			<Envelope />
		</SocialLink>
	</div>

	<Clock />
	<Weather />

	<DiscordInfo />
	<SpotifyInfo />
	<DiscordInfo2 />

<p class="mt-4 mb-4 text-gray-400">
	Currently, my favorite album is <span class="text-violet-800"><b>&ldquo;ALIKA&rdquo;</b></span> by <span class="text-blue-800"><b>ALIKA</b></span>. My favourite song from the album is <span class="text-rose-400">&ldquo;<b>Ты Расскажи Мне&rdquo;</b></span>.
</p>

<div style="border-radius: 13px; overflow: hidden;">
    <iframe title="ALIKA - ALIKA | Spotify" src="https://open.spotify.com/embed/album/2qGwXvw1kIv5zPpwqXVLjR?utm_source=generator" width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
</div>

			
</main>
