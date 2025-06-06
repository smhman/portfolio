import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const data = await request.json();

	// 👇 DO NOT wrap it in `{ value: ... }`
	const res = await fetch(
		`${process.env.UPSTASH_REDIS_REST_URL}/set/last-cider`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ value: data }) // ✅ store object directly
		}
	);

	if (!res.ok) {
		return json({ error: 'Failed to save to Redis' }, { status: 500 });
	}

	return json({ success: true });
}
