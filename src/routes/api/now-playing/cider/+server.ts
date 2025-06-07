import { json } from '@sveltejs/kit';

function transformImageUrl(raw: string) {
	const split = raw?.split('/https/');
	if (split?.[1]) return `https://${split[1]}`;
	return raw;
}

export async function GET({ url }) {
	const discordId = url.searchParams.get('id');
	if (!discordId) return json({ error: 'Missing Discord ID' }, { status: 400 });

	const res = await fetch(`https://api.lanyard.rest/v1/users/1113690068113170484`);
	const { data } = await res.json();

	const cider = data.activities?.find((a) => a.name.toLowerCase().includes('cider') && a.type === 2);
	if (!cider) return json({ error: 'No Cider activity found' }, { status: 204 });

	const track = cider.details;
	const artist = cider.state?.replace(/^by /i, '') ?? 'Unknown Artist';

	let appleLink = 'https://music.apple.com';
	try {
		const appleRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`${track} ${artist}`)}&entity=song&limit=1`);
		const appleData = await appleRes.json();
		if (appleData.results?.[0]?.trackId) {
			appleLink = `https://music.apple.com/song/${appleData.results[0].trackId}`;
		}
	} catch (e) {
		console.warn('[Apple Lookup Failed]');
	}

	const albumArt = transformImageUrl(cider.assets?.large_image ?? '');
	const duration = cider.timestamps?.end && cider.timestamps?.start
		? cider.timestamps.end - cider.timestamps.start
		: 0;

	return json({
		isPlayingNow: true,
		isPaused: false,
		progressMs: Date.now() - cider.timestamps.start,
		track: {
			name: track,
			album: {
				name: cider.assets?.large_text ?? 'Unknown Album',
				images: albumArt ? [{ url: albumArt }] : []
			},
			artists: [{ name: artist }],
			duration_ms: duration,
			is_local: true,
			external_urls: {
				apple: appleLink,
				spotify: null
			}
		}
	});
}
