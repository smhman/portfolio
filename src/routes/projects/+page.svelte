<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import Project from './Project.svelte';
</script>

<Meta title="Projects – sundei" description="My projects." />

<main class="wrapper fade">
	<h1 class="header">Projects</h1>

	<p class="mt-4 mb-8 text-gray-400">Some of my projects.</p>

	<Project
		name="Bubble Blaster"
		href="https://github.com/smhman/example-game"
		src="/images/projects/jumpscare.png"
	>
		Small project, which was made
		in programming classes.
	</Project>

	<Project
		name="afke.ee"
		href="https://afke.ee"
		src="/images/projects/afkeleht.png"
	>
		A small page for my friend
		afke, who is a YouTuber and musician.
	</Project>
	<!--<Project
		name="Online Radio Player"
		href="https://raadio.sundei.eu/"
		src="/images/projects/raadio.jpg"
	>
		A small online radio player,
		which has Estonian radios
	</Project> -->
</main>
