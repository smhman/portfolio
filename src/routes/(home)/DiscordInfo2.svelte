	<script lang="ts">
		import { onMount, onDestroy } from 'svelte';
		import { differenceInSeconds } from 'date-fns';
		import { useLanyard } from 'sk-lanyard';
		import Discord from '$lib/components/icons/Discord.svelte';

		const discordId = '1113690068113170484';
		const lanyard = useLanyard({
			method: 'rest',
			pollInterval: 100,
			id: discordId
		});

		const statusColors: Record<string, string> = {
			online: 'bg-emerald-500',
			idle: 'bg-amber-400',
			dnd: 'bg-rose-400',
			offline: 'bg-gray-600'
		};

		let now = new Date();
		let interval;

		$: customStatus = $lanyard?.activities?.find(a => a.type === 4);

		onMount(() => {
			interval = setInterval(() => {
				now = new Date(); // Update `now` to trigger reactivity
			}, 50);
		});

		onDestroy(() => {
			clearInterval(interval);
		});

		function formatTime(activity) {
			if (activity?.timestamps?.end) {
				const endTimestamp = new Date(activity.timestamps.end);
				const durationInSeconds = differenceInSeconds(endTimestamp, now);
				if (durationInSeconds < 0) {
					return "Activity ended";
				}
				return formatDuration(durationInSeconds, "left");
			} else if (activity?.created_at) {
				const createdAtTimestamp = new Date(activity.created_at);
				const elapsedInSeconds = differenceInSeconds(now, createdAtTimestamp);
				if (elapsedInSeconds < 0) {
					return "Just started";
				}
				return formatDuration(elapsedInSeconds, "elapsed");
			} else {
				return "No time information available.";
			}
		}

		function formatDuration(seconds, label) {
			if (seconds >= 86400) {
				const days = Math.floor(seconds / 86400);
				return `${days} days ${label}`;
			} else {
				const hours = Math.floor(seconds / 3600);
				const minutes = Math.floor((seconds % 3600) / 60);
				const secs = seconds % 60;
				return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} ${label}`;
			}
		}

		function shouldDisplayActivity(activity) {
			const excludedTypes = [4];
			const excludedNames = ['Custom Status', 'Spotify', 'Cider'];

			return !excludedTypes.includes(activity.type) && !excludedNames.includes(activity.name);
		}

		function transformImageUrl(url) {
			const urlParts = url.split('/https/');
			if (urlParts.length > 1) {
				return `https://${urlParts[1]}`;
			}
			return url;
		}

		function getLocalLogo(activityName) {
			const cdnBaseUrl = "https://cdn.sundei.eu/images/website/";
			
			const logoMap = {
				"Growtopia": `${cdnBaseUrl}growtopia.jpg`,
				"Counter-Strike 2": `${cdnBaseUrl}CounterStrike.png`
			};

			return logoMap[activityName] || null;
		}

		function cleanState(state) {
			// Remove unnecessary parts like "custom" from the state
			if (state && state.toLowerCase().includes("custom")) {
				return state.replace(/custom/i, "").trim();
			}
			if (state && state.toLowerCase().includes("of channel:")) {
				return state.replace(/of channel:/i, "").trim();
			}
			return state ? state.trim() : '';
		}
		function reformatDetails(activity) {
			if (activity.type === 3) {
				return `Watching ${activity.name}`;
			}

			// Fallbacks or other types handled here
			if (activity.type === 6 && activity.details) {
				return `Right now, I'm ${activity.details.trim()}`;
			}

			if (activity.name === 'YouTube' && activity.details?.startsWith('Searching for:') && activity.state) {
				return `${activity.details.trim()} ${cleanState(activity.state)}`;
			}

			if (activity.name === 'YouTube' && activity.details?.startsWith('Viewing playlist:') && activity.state) {
				return `${activity.details.trim()} ${cleanState(activity.state)}`;
			}

			if (activity.details) {
				const lowerDetails = activity.details.toLowerCase();
				const channelName = cleanState(activity.state) || "";

				if (lowerDetails.includes("browsing through all videos")) {
					return `Browsing through ${channelName}'s videos`;
				}
				if (lowerDetails.includes("browsing through latest videos")) {
					return `Browsing through ${channelName}'s latest videos`;
				}
				if (lowerDetails.includes("browsing through playlists")) {
					return `Browsing through ${channelName}'s playlists`;
				}
				if (lowerDetails.includes("viewing channel")) {
					return `Viewing ${channelName}'s channel`;
				}
				if (lowerDetails.includes("viewing community posts")) {
					return `Viewing ${channelName}'s community posts`;
				}

				if (activity.name === 'YouTube') {
					return `${activity.details}${channelName ? ` | ${channelName}` : ''}`;
				}
			}

			return activity.details || '';
		}


		function getActivityImage(activity) {
			if (activity.type === 6 && activity.emoji && activity.emoji.id) {
				return getEmojiUrl(activity.emoji.id);
			}

			// Handle osu! specific large image
			if (activity.name === 'osu!') {
				// Force custom osu! logo override
				return 'https://cdn.discordapp.com/app-assets/1216669957799018608/1252834872297259048.png';
			}

			// Handle general large images from assets
			if (activity.assets?.large_image && activity.assets.large_image.includes('https')) {
				return transformImageUrl(activity.assets.large_image);
			}

			// Fallback to application-specific image if available
			if (activity.application_id && activity.assets?.large_image) {
				return getDiscordAppImageUrl(activity.application_id, activity.assets.large_image);
			}

			// Use local logos if available
			if (getLocalLogo(activity.name)) {
				return getLocalLogo(activity.name);
			}

			return null;
		}
		function getActivitySmallImage(activity) {
			// Handle osu! specific small image
			if (activity.name === 'osu!' && activity.application_id && activity.assets?.small_image) {
				return getDiscordAppImageUrl(activity.application_id, activity.assets.small_image);
			}

			// Handle general small images from assets
			if (activity.assets?.small_image && activity.assets.small_image.includes('https')) {
				return transformImageUrl(activity.assets.small_image);
			}

			// Fallback to application-specific small image if available
			if (activity.application_id && activity.assets?.small_image) {
				return getDiscordAppImageUrl(activity.application_id, activity.assets.small_image);
			}

			return null;
		}

		function filterUniqueActivities(activities) {
			const uniqueActivities = [];
			const seenNames = new Set();

			for (const activity of activities) {
				if (activity.name === 'SoundCloud') {
					if (!seenNames.has('SoundCloud')) {
						seenNames.add('SoundCloud');
						uniqueActivities.push(activity);
					}
				} else {
					uniqueActivities.push(activity);
				}
			}

			return uniqueActivities;	
		}

		function getDiscordAppImageUrl(applicationId, imageId) {
			return `https://cdn.discordapp.com/app-assets/${applicationId}/${imageId}.webp?size=512`;
		}

		function getEmojiUrl(emojiId) {
			return `https://cdn.discordapp.com/emojis/${emojiId}.png`;
		}

function getDisplayText(activity) {
	if (activity.name === 'osu!') {
		const state = activity.state || '';
		const rank = activity.assets?.large_text || '';

		if (state.toLowerCase() === 'clicking circles') {
			return `| ${state}`;
		}

		if (rank && state) {
			return `${rank} | ${state}`;
		}

		return rank || state;
	}

	const state = activity.state?.trim() || '';

	// Clean up cases where state might be something like "Searching for: |"
	if (state.startsWith('Searching for:')) {
		return state.replace(/\|\s*$/, '').trim();
	}

	// Remove lone pipes
	if (state === '|') {
		return '';
	}

	return state;
}

	</script>

	<style>
		.activity-image-container {
			position: relative;
			width: 48px;
			height: 48px;
			overflow: hidden;
			border-radius: 8px;
		}

		.activity-image {
			width: 100%;
			height: 100%;
			object-fit: cover;
			border-radius: 8px;
		}

		.overlay-icon {
			position: absolute;
			bottom: -2px;
			right: -2px;
			width: 16px;
			height: 16px;
			background-color: white;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
		}

		.overlay-icon img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	</style>

	<!-- Activities Block -->
	{#if $lanyard?.activities}
		<div class="mt-4 bg-gray-800 p-4 rounded-lg">
			<h3 class="text-white font-semibold">Current Activities</h3>
			{#each filterUniqueActivities($lanyard.activities) as activity (activity.id)}
				{#if shouldDisplayActivity(activity)}
					<div class="mt-2 flex items-center text-sm">
						{#if getActivityImage(activity)}
							<div class="activity-image-container">
								<img src={getActivityImage(activity)} alt="{activity.name} Logo" class="activity-image" />
								{#if getActivitySmallImage(activity)}
									<div class="overlay-icon">
										<img src={getActivitySmallImage(activity)} alt="Small Image" />
									</div>
								{/if}
							</div>
						{:else}
							<div class="activity-image-container">
								<div class="activity-image bg-gray-700 grid place-items-center">
									<span class="text-white">N/A</span>
								</div>
							</div>
						{/if}
						<div class="ml-4">
							<p class="opacity-80 font-semibold">
								{reformatDetails(activity)}
							</p>
							{#if activity.state && activity.state !== activity.name && activity.state !== activity.details}
								<p class="opacity-80">{getDisplayText(activity)}</p>
							{/if}

							<p class="opacity-80">
								{formatTime(activity)}
								{#if activity.assets?.small_text && !(activity.state && (activity.state.toLowerCase() === 'idle' || activity.state.toLowerCase() === 'afk'))}
									| {activity.assets.small_text}
								{/if}
							</p>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
