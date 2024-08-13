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
</script>

<!-- Activities Block -->
{#if $lanyard?.activities}
	<div class="mt-4 bg-gray-800 p-4 rounded-lg">
		<h3 class="text-white font-semibold">Current Activities</h3>
		{#each $lanyard.activities as activity (activity.id)}
			{#if shouldDisplayActivity(activity)}
				<div class="mt-2 text-sm">
					<p class="opacity-80">
						{activity.name}
					</p>
					{#if activity.details && activity.state}
						<p class="opacity-80">
							{activity.details} | {activity.state}
						</p>
					{/if}
					<p class="opacity-80">
						{formatTime(activity)}
					</p>
				</div>
			{/if}
		{/each}
	</div>
{/if}
