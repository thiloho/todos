<script lang="ts">
	export let dateString: string;
	export let withTime = false;
</script>

<time datetime={new Date(dateString).toISOString()}
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
