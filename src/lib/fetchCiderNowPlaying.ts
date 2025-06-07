export async function fetchCiderNowPlaying(discordId: string) {
	try {
		const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
		const { data } = await res.json();

		if (!data.activities) return null;

		const cider = data.activities.find((a) =>
			a.name.toLowerCase().includes('cider') && a.type === 2
		);

		if (!cider) {
			console.log('[Cider] No Cider activity found');
			return null;
		}

		function transformImageUrl(url: string) {
			const urlParts = url.split('/https/');
			if (urlParts.length > 1) {
				return `https://${urlParts[1]}`;
			}
			return url;
		}

		const rawImage = cider.assets?.large_image ?? '';
		const albumArt = transformImageUrl(rawImage);

		return {
			isPlayingNow: true,
			isPaused: false,
			track: {
				name: cider.details,
				album: {
					name: cider.assets?.large_text ?? "Unknown Album",
					images: albumArt ? [{ url: albumArt }] : []
				},
				artists: [{ name: cider.state?.replace(/^by /i, "") ?? "Unknown Artist" }],
				duration_ms: cider.timestamps.end - cider.timestamps.start,
				external_urls: {
					apple: "https://music.apple.com",
					spotify: null
				},
				is_local: true
			},
			progressMs: Date.now() - cider.timestamps.start
		};
	} catch (e) {
		console.error('[Cider] Failed to fetch now playing:', e);
		return null;
	}
}
