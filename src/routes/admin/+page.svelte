<script>
	import { onMount } from 'svelte';

	let textEt = '', textEn = '', textRu = '', show = true;
	let message = '';
	const endpoint = 'https://notif-server.sundei.eu/notification';

	onMount(async () => {
		const res = await fetch(endpoint);
		if (res.ok) {
			const data = await res.json();
			textEt = data.textEt;
			textEn = data.textEn;
			textRu = data.textRu;
			show = data.show ?? true;
		}
	});

	async function save() {
		const res = await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ textEt, textEn, textRu, show })
		});
		message = res.ok ? '✅ Saved!' : '❌ Failed to save.';
	}
</script>

<main>
	<h1>🛠️ Notification Admin</h1>

	<div class="field-group">
		<label for="et">Text (Estonian)</label>
		<textarea id="et" bind:value={textEt} placeholder="Estonian notification..."></textarea>
	</div>

	<div class="field-group">
		<label for="en">Text (English)</label>
		<textarea id="en" bind:value={textEn} placeholder="English notification..."></textarea>
	</div>

	<div class="field-group">
		<label for="ru">Text (Russian)</label>
		<textarea id="ru" bind:value={textRu} placeholder="Russian notification..."></textarea>
	</div>

	<div class="field-group checkbox">
		<label>
			<input type="checkbox" bind:checked={show} />
			Show Notification
		</label>
	</div>

	<button on:click={save}>💾 Save Changes</button>

	{#if message}
		<p class="message">{message}</p>
	{/if}
</main>

<style>
	:root {
		color-scheme: dark;
	}

	main {
		max-width: 700px;
		margin: 2rem auto;
		padding: 2rem;
		background: #1e1e2f;
		border-radius: 12px;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
		font-family: system-ui, sans-serif;
		color: #eee;
	}

	h1 {
		font-size: 1.8rem;
		margin-bottom: 1.5rem;
		text-align: center;
		color: #fff;
	}

	.field-group {
		margin-bottom: 1.25rem;
	}

	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #444;
		border-radius: 8px;
		font-size: 1rem;
		resize: vertical;
		min-height: 80px;
		background: #111;
		color: #eee;
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.4rem;
		color: #ccc;
	}

	.checkbox label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 500;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		font-size: 1.1rem;
		background-color: #2563eb;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	button:hover {
		background-color: #1e40af;
	}

	.message {
		margin-top: 1rem;
		text-align: center;
		font-weight: 600;
		color: #22c55e;
	}
</style>
