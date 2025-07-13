<script lang="ts">
	import Clock from './Clock.svelte';
	import DiscordInfo from './DiscordInfo.svelte';
	import DiscordInfo2 from './DiscordInfo2.svelte';
	import SocialLink from './SocialLink.svelte';
	import SpotifyInfo from './SpotifyInfo.svelte';
	import AppleMusicInfo from './AppleMusicInfo.svelte';
	import Weather from './Weather.svelte';

	import GitHub from '$lib/components/icons/GitHub.svelte';
	import Envelope from '$lib/components/icons/Envelope.svelte';
	import Linkedin from '$lib/components/icons/Linkedin.svelte';
	import Spotify from '$lib/components/icons/Spotify.svelte';
	import Twitter from '$lib/components/icons/Twitter.svelte';
	import Meta from '$lib/components/Meta.svelte';
</script>

<Meta title="sundei" description="My portfolio and personal website." />

<main class="wrapper fade">
	<h1 class="header">sundei</h1>

	<p class="mt-4 text-gray-400">
		Name: <b>sundei</b><br>
		Location: <b><span class="text-teal-400">Tartu, Estonia</span></b>.
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
	<AppleMusicInfo />
	<DiscordInfo2 />

<!--<p class="mt-4 mb-4 text-gray-400">
	Currently, my favorite album is <span class="text-violet-800"><b>&ldquo;&rdquo;</b></span> by <span class="text-blue-800"><b></b></span>. My favourite song from the album is <span class="text-rose-400">&ldquo;<b>&rdquo;</b></span>.
</p>-->
<p>
	
<!-- Wrapper container to align both cards visually -->
<div style="max-width: 420px; margin: 0 auto; padding: 10px; font-family: sans-serif;">
  
  <!-- Spotify card -->
  <div style="margin-bottom: 20px; border-radius: 13px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
    <iframe title="Victoria Justice - Treat Myself | Spotify" 
            src="https://open.spotify.com/embed/track/1KduF4t7FmMPKbu8U5GvsI" 
            width="100%" 
            height="152" 
            frameborder="0" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy">
    </iframe>
  </div>

  <!-- osu! card -->
  <a href="https://osu.ppy.sh/u/ScissorLuv" target="_blank" 
     style="display: block; border-radius: 13px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
    <img 
      src="https://osu-sig.vercel.app/card?user=ScissorLuv&mode=std&lang=en&round_avatar=true&animation=true&hue=125" 
      alt="ScissorLuv osu! stats"
      style="width: 100%; height: auto; display: block;"
    />
  </a>

</div>

			
</main>
