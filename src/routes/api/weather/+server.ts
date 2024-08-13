import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export async function GET({ fetch, setHeaders }) {
	const data = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?lat=58.3806&lon=26.7251&units=metric&appid=${env.WEATHER_API_KEY}`
	).then(res => res.json());

	setHeaders({
		'Cache-Control': 'public, max-age=0, s-maxage=300'
	});

	return json(data);
}
