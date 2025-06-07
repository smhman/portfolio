import { json } from '@sveltejs/kit';

const DISCORD_ID = '1113690068113170484';

// In-memory cache (persists while the server is running)
let lastKnownTrack: any = null;

function transformImageUrl(raw: string) {
	const split = raw?.split('/https/');
	if (split?.[1]) return `https://${split[1]}`;
	return raw;
}

async function getAppleMusicLink(track: string, artist: string) {
	try {
		const query = encodeURIComponent(`${track} ${artist}`);
		const url = `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`;
		const res = await fetch(url);
		const json = await res.json();
		return json.results?.[0]?.trackId
			? `https://music.apple.com/song/${json.results[0].trackId}`
			: 'https://music.apple.com';
	} catch (e) {
		console.warn('[Apple Lookup Failed]', e);
		return 'https://music.apple.com';
	}
}

export async function GET() {
	try {
		const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
		const { data } = await res.json();

		const cider = data.activities?.find((a) =>
			a.name.toLowerCase().includes('cider') && a.type === 2
		);

		if (cider) {
			const track = cider.details;
			const artist = cider.state?.replace(/^by /i, '') ?? 'Unknown Artist';

			const appleLink = await getAppleMusicLink(track, artist);
			const albumArt = transformImageUrl(cider.assets?.large_image ?? '');
			const duration = cider.timestamps?.end && cider.timestamps?.start
				? cider.timestamps.end - cider.timestamps.start
				: 0;

			const payload = {
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
			};

			lastKnownTrack = payload;
			return json(payload);
		}

		// Fallback to cached last known track
		if (lastKnownTrack) {
			return json({ ...lastKnownTrack, isPlayingNow: false });
		}

		// Nothing to return
		return json({ error: 'No Cider activity found' }, { status: 204 });
	} catch (err) {
		console.error('[Cider] API failed:', err);
		return json({ error: 'Server error' }, { status: 500 });
	}
}
