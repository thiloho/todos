<script lang="ts">
	export let type: string;
	export let text: string;
</script>

<div
	class="flex gap-2 items-start max-w-prose p-4 border rounded {type === 'info'
		? 'border-blue-900 dark:border-blue-400'
		: 'border-red-900 dark:border-red-400'}"
>
	{#if type === 'info'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class="w-5 h-5 text-blue-900 shrink-0 dark:text-blue-400"
		>
			<path
				fill-rule="evenodd"
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
				clip-rule="evenodd"
			/>
		</svg>
	{/if}
	{#if type === 'danger'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class="w-5 h-5 text-red-900 shrink-0 dark:text-red-400"
		>
			<path
				fill-rule="evenodd"
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
				clip-rule="evenodd"
			/>
		</svg>
	{/if}
	<p>{@html text}</p>
</div>
