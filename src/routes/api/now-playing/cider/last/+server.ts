import { json } from '@sveltejs/kit';

export async function GET() {
	const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/last-cider`, {
		headers: {
			Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
		}
	});

	const result = await res.json();

	if (!result.result) {
		return json({ error: 'No saved track' }, { status: 404 });
	}

	// ✅ result.result is a JSON string
	let parsed;
	if (typeof result.result === 'string') {
		// case: JSON string stored in Redis
		const outer = JSON.parse(result.result); // { value: '{...}' }
		parsed = typeof outer.value === 'string' ? JSON.parse(outer.value) : outer.value;
	} else {
		// case: already object (in dev/testing)
		parsed = result.result;
	}

	return json(parsed); // 👈 returns clean JSON to frontend
}
