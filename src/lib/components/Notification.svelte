<script lang="ts">
	export let type: string;
	export let text: string;
</script>

<div
	class="flex gap-2 items-start max-w-prose p-4 border rounded {type === 'info'
		? 'border-blue-700 dark:border-blue-400'
		: 'border-red-700 dark:border-red-400'}"
>
	{#if type === 'info'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 16 16"
			fill="currentColor"
			class="w-4 h-4 text-blue-700 shrink-0 dark:text-blue-400"
		>
			<path
				fill-rule="evenodd"
				d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
				clip-rule="evenodd"
			/>
		</svg>
	{/if}
	{#if type === 'danger'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 16 16"
			fill="currentColor"
			class="w-4 h-4 text-red-700 shrink-0 dark:text-red-400"
		>
			<path
				fill-rule="evenodd"
				d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
				clip-rule="evenodd"
			/>
		</svg>
	{/if}
	<p>{@html text}</p>
</div>
