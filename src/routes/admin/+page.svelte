<script>
	import { onMount } from 'svelte';
	let textEt = '', textEn = '', textRu = '';
	let message = '';

	const endpoint = 'https://notif-server.sundei.eu/notification';

	onMount(async () => {
		const res = await fetch(endpoint);
		if (res.ok) {
			const data = await res.json();
			textEt = data.textEt;
			textEn = data.textEn;
			textRu = data.textRu;
		}
	});

	async function save() {
		const res = await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ textEt, textEn, textRu })
		});
		message = res.ok ? 'Saved!' : 'Failed to save.';
	}
</script>

<h1>Admin Panel</h1>

<label>Text (Estonian)</label>
<textarea bind:value={textEt} rows="4"></textarea>

<label>Text (English)</label>
<textarea bind:value={textEn} rows="4"></textarea>

<label>Text (Russian)</label>
<textarea bind:value={textRu} rows="4"></textarea>

<button on:click={save}>Save</button>
<p>{message}</p>

<style>
	textarea {
		width: 100%;
		margin-bottom: 1rem;
	}
	button {
		padding: 0.5rem 1rem;
	}
</style>
