<script lang="ts">
	import { page } from '$app/stores';
</script>

<main class="wrapper fade">
	<h1 class="header">
		{$page.status} &ndash;
		{$page.error?.message ?? 'Unknown error'}
	</h1>

	<p class="mt-4 text-gray-400">
		Seems like this page doesn't exist.</p>
	<p class="text-gray-400"> Let's go back
		<a href="/" class="text-white">home</a>
		or listen to <span class="text-white">mis minuga saab</span> by <span class="text-white">ALIKA</span> & <span class="text-white">villemdrillem</span>.
	</p>
<p class="mt-4 mb-4 text-gray-400">
	<iframe style="border-radius:14px" src="https://open.spotify.com/embed/track/4LBbFRJsMzjHSZwupmDPWq?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
</p>	
</main>
