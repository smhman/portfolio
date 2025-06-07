import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const data = await request.json();

	const encodedValue = encodeURIComponent(JSON.stringify(data));

	const res = await fetch(
		`${process.env.UPSTASH_REDIS_REST_URL}/set/last-cider?value=${encodedValue}`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
			}
		}
	);

	if (!res.ok) {
		return json({ error: 'Failed to save to Redis' }, { status: 500 });
	}

	return json({ success: true });
}
