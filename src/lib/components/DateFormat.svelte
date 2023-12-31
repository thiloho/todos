<script lang="ts">
	export let dateString: string;
	export let withTime = false;
	import { getLocalISOString } from '$lib/utilities';
</script>

<time datetime={getLocalISOString(new Date(dateString))}
	>{new Date(dateString).toLocaleDateString('en-US', {
		weekday: 'short',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})}
	{#if withTime}
		{new Date(dateString).toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit'
		})}
	{/if}
</time>
