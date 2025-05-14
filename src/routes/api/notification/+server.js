import fs from 'fs';
import path from 'path';

const file = path.resolve('static/notification.json');

export async function GET() {
	const data = fs.readFileSync(file, 'utf-8');
	return new Response(data, {
		headers: { 'Content-Type': 'application/json' }
	});
}

export async function POST({ request }) {
	const body = await request.json();
	fs.writeFileSync(file, JSON.stringify(body, null, 2));
	return new Response(JSON.stringify({ success: true }), {
		headers: { 'Content-Type': 'application/json' }
	});
}
