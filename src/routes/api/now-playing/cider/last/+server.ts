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

	return json(result.result); // ✅ no need to parse further
}
