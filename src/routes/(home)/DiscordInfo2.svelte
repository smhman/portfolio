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
			now = new Date();
		}, 50);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	function formatTime(activity) {
		if (activity?.timestamps?.end) {
			const endTimestamp = new Date(activity.timestamps.end);
			const durationInSeconds = differenceInSeconds(endTimestamp, now);
			return durationInSeconds < 0
				? "Activity ended"
				: formatDuration(durationInSeconds, "left");
		} else if (activity?.timestamps?.start) {
			const startedAt = new Date(activity.timestamps.start);
			const elapsedInSeconds = differenceInSeconds(now, startedAt);
			return elapsedInSeconds < 0
				? "Just started"
				: formatDuration(elapsedInSeconds, "elapsed");
		} else if (activity?.created_at) {
			const createdAtTimestamp = new Date(activity.created_at);
			const elapsedInSeconds = differenceInSeconds(now, createdAtTimestamp);
			return elapsedInSeconds < 0
				? "Just started"
				: formatDuration(elapsedInSeconds, "elapsed");
		}
		return "No time information available.";
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
		return urlParts.length > 1 ? `https://${urlParts[1]}` : url;
	}

	function getLocalLogo(activityName) {
		const cdnBaseUrl = "https://cdn.sundei.eu/images/website/";
		const logoMap = {
			"Growtopia": `${cdnBaseUrl}growtopia.jpg`,
			"Counter-Strike 2": `${cdnBaseUrl}CounterStrike.png`
		};
		return logoMap[activityName] || null;
	}

	function getDiscordAppImageUrl(applicationId, imageId) {
		return `https://cdn.discordapp.com/app-assets/${applicationId}/${imageId}.webp?size=512`;
	}

	function getEmojiUrl(emojiId) {
		return `https://cdn.discordapp.com/emojis/${emojiId}.png`;
	}

	function getActivityImage(activity) {
		if (activity.type === 6 && activity.emoji?.id) return getEmojiUrl(activity.emoji.id);
		if (activity.name === 'osu!') return 'https://cdn.discordapp.com/app-assets/1216669957799018608/1252834872297259048.png';
		if (activity.assets?.large_image?.includes('https')) return transformImageUrl(activity.assets.large_image);
		if (activity.application_id && activity.assets?.large_image) return getDiscordAppImageUrl(activity.application_id, activity.assets.large_image);
		if (getLocalLogo(activity.name)) return getLocalLogo(activity.name);
		return null;
	}

	function getActivitySmallImage(activity) {
		if (activity.name === 'osu!' && activity.application_id && activity.assets?.small_image) {
			return getDiscordAppImageUrl(activity.application_id, activity.assets.small_image);
		}
		if (activity.assets?.small_image?.includes('https')) return transformImageUrl(activity.assets.small_image);
		if (activity.application_id && activity.assets?.small_image) return getDiscordAppImageUrl(activity.application_id, activity.assets.small_image);
		return null;
	}

	function mapOsuLazerToClassic(activity) {
		if (activity.name !== 'osu!(lazer)') return activity;
		const displayName = activity.assets?.large_text?.split(' (')[0] || 'osu!player';
		return {
			...activity,
			name: 'osu!',
			details: displayName,
			state: activity.state || 'Clicking Circles',
			assets: {
				large_image: '1252834872297259048',
				large_text: displayName,
				small_image: '1216675677709795328',
				small_text: activity.assets?.small_text || 'osu!'
			}
		};
	}

	function filterUniqueActivities(activities) {
		const unique = [];
		let seenOsu = false;
		for (const activity of activities) {
			if ((activity.name === 'osu!' || activity.name === 'osu!(lazer)') && !seenOsu) {
				seenOsu = true;
				unique.push(mapOsuLazerToClassic(activity));
			} else if (!['osu!', 'osu!(lazer)'].includes(activity.name)) {
				unique.push(activity);
			}
		}
		return unique;
	}
</script>

<style>
	.activity-image-container {
		position: relative;
		width: 48px;
		height: 48px;
		overflow: hidden;
		border-radius: 8px;
		flex-shrink: 0;
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
							{#if activity.type === 3}
								Watching {activity.name}
							{:else if activity.type === 0}
								Playing {activity.name}
							{:else}
								{activity.name}
							{/if}
						</p>

						{#if activity.name === 'osu!'}
							<p class="opacity-80">
								{activity.details}
								{activity.details && activity.state ? ' | ' : ''}
								{activity.state}
							</p>
						{:else if activity.details || activity.state}
							<p class="opacity-80">
								{activity.details || ''}
								{(activity.details && activity.state) ? ' | ' : ''}
								{activity.state || ''}
							</p>
						{/if}

						<p class="opacity-80">
							{#if activity.assets?.small_text && !(activity.state?.toLowerCase() === 'idle' || activity.state?.toLowerCase() === 'afk')}
								{activity.assets.small_text} |
							{/if}
							{formatTime(activity)}
						</p>
					</div>
				</div>
			{/if}
		{/each}
	</div>
{/if}
