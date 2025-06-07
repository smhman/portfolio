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

	try {
		// 👇 This is the fix: parse the JSON string inside "result.result"
		const parsed = JSON.parse(result.result);
		return json(parsed);
	} catch (e) {
		console.error('[Redis Parse Error]', e);
		return json({ error: 'Corrupted cached data' }, { status: 500 });
	}
}
