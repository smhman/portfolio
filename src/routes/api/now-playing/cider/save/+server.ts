import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const data = await request.json();

	await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/set/last-cider`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ value: JSON.stringify(data) })
	});

	return json({ success: true });
}
