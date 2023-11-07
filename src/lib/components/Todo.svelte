<script lang="ts">
	export let taskId: string;
	export let title: string;
	export let isCompleted = false;

	let showSidebar = false;
</script>

<li
	class="ps-4 pe-2 py-2 border border-neutral-200 bg-neutral-100 rounded flex gap-2 items-center dark:bg-neutral-800 dark:border-neutral-700"
>
	<input id={taskId} type="checkbox" checked={isCompleted} class="scale-125" />
	<label for={taskId}>{title}</label>
	<button
		title="Edit task"
		class="btn btn-icon ms-auto bg-neutral-200 border-neutral-300 dark:bg-neutral-700 dark:border-neutral-600"
		on:click={() => (showSidebar = true)}
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
			<path
				d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"
			/>
			<path
				d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"
			/>
		</svg>
	</button>
</li>

{#if showSidebar}
	<div
		class="fixed end-0 top-0 border-s border-neutral-200 bg-white p-4 h-full w-[min(theme(width.64),theme(width.3/4))] flex flex-col gap-4 dark:bg-neutral-900 dark:border-neutral-800"
	>
		<button
			title="Close sidebar"
			on:click={() => (showSidebar = false)}
			class="btn btn-icon self-end"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
				/>
			</svg>
		</button>
		<h2>Edit todo</h2>
	</div>
{/if}
