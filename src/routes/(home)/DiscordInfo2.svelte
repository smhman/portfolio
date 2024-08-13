<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { differenceInSeconds } from 'date-fns';
	import { useLanyard } from 'sk-lanyard';
	import Discord from '$lib/components/icons/Discord.svelte';

	const discordId = '1113690068113170484';
	const lanyard = useLanyard({
		method: 'rest',
		pollInterval: 1000,
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
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	function formatTime(activity) {
		if (activity?.timestamps?.end) {
			const endTimestamp = new Date(activity.timestamps.end);
			const durationInSeconds = differenceInSeconds(endTimestamp, now);
			if (durationInSeconds < 0) {
				// If the duration is negative, the activity has ended
				return "Activity ended";
			}
			return formatDuration(durationInSeconds, "left");
		} else if (activity?.created_at) {
			const createdAtTimestamp = new Date(activity.created_at);
			const elapsedInSeconds = differenceInSeconds(now, createdAtTimestamp);
			if (elapsedInSeconds < 0) {
				// If the elapsed time is negative, something went wrong
				return "Invalid time";
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
		const excludedTypes = [4]; // Add more types if needed
		const excludedNames = ['Custom Status', 'Spotify']; // Add more names if needed
		
		return !excludedTypes.includes(activity.type) && !excludedNames.includes(activity.name);
	}

	function transformImageUrl(url) {
		// Find the last occurrence of /https/ and use the substring after it
		const urlParts = url.split('/https/');
		if (urlParts.length > 1) {
			return `https://${urlParts[1]}`;
		}
		// If it doesn't match the expected pattern, return the original URL
		return url;
	}

	// New function to filter out duplicate SoundCloud activities and others
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
</script>

<style>
	.activity-image-container {
		position: relative;
		width: 48px;
		height: 48px;
	}

	.activity-image {
		width: 100%;
		height: 100%;
		border-radius: 8px;
	}

	.overlay-icon {
		position: absolute;
		bottom: -2px; /* Adjusted to better position the small icon */
		right: -2px;  /* Adjusted to better position the small icon */
		width: 16px;
		height: 16px;
		background-color: white; /* Ensures the icon has a white background */
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5); /* Adds a subtle shadow for depth */
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
					<!-- Display large image with small image overlay if available -->
					{#if activity.assets?.large_image}
						<div class="activity-image-container">
							<img src={transformImageUrl(activity.assets.large_image)} alt="Large Image" class="activity-image" />
							<!-- Display small image as an icon in the corner -->
							{#if activity.assets?.small_image}
								<div class="overlay-icon">
									<img src={transformImageUrl(activity.assets.small_image)} alt="Small Image" />
								</div>
							{/if}
						</div>
					{/if}
					<div class="ml-4">
						<p class="opacity-80 font-semibold">
							{activity.name}
						</p>
						<!-- Display details and state depending on availability -->
						<p class="opacity-80">
							{activity.details}
							{#if activity.details && activity.state}
								|
							{/if}
							{activity.state}
						</p>
						<!-- Display time and small text if available -->
						<p class="opacity-80">
							{formatTime(activity)}
							{#if activity.assets?.small_text}
								| {activity.assets.small_text}
							{/if}
						</p>
					</div>
				</div>
			{/if}
		{/each}
	</div>
{/if}
 