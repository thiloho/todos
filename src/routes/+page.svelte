<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import OrganizeSelect from '$lib/components/OrganizeSelect.svelte';
	import TodoList from '$lib/components/TodoList.svelte';
	import { isEditingItem } from '$lib/stores';

	export let data: PageData;

	export let form: ActionData;

	let exportType = 'json';

	interface JSONItem {
		[key: string]: string | number | boolean | null;
	}

	const copyExportTasks = async () => {
		const jsonReplacer = (key: string, value: any) => {
			if (key === 'user_id' || key === 'category_id') {
				return undefined;
			}
			return value;
		};
		const jsonTasks = JSON.stringify(data.allTodos, jsonReplacer, 2);

		const jsonToCSV = (jsonArray: JSONItem[]) => {
			const replacer = (_: string, value: any) => (value === null ? '' : value);
			const header = Object.keys(jsonArray[0]);
			const csv = jsonArray.map((row) =>
				header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')
			);
			csv.unshift(header.join(','));
			return csv.join('\r\n');
		};

		const jsonToMarkdown = (jsonArray: JSONItem[]) => {
			return jsonArray
				.map((item) => {
					const checkbox = item.is_completed ? '- [x]' : '- [ ]';
					return (
						`${checkbox} **ID:** ${item.id} - **Title:** ${item.title}\n` +
						`    - **Important:** ${item.is_important ? 'Yes' : 'No'}\n` +
						`    - **Due date:** ${item.due_date || 'None'}\n` +
						`    - **Overdue:** ${item.is_overdue ? 'Yes' : 'No'}\n` +
						`    - **Created at:** ${item.created_at}\n` +
						`    - **Updated at:** ${item.updated_at}`
					);
				})
				.join('\n\n');
		};

		try {
			switch (exportType) {
				case 'json':
					await navigator.clipboard.writeText(jsonTasks);
					break;
				case 'csv':
					await navigator.clipboard.writeText(jsonToCSV(JSON.parse(jsonTasks)));
					break;
				case 'markdown':
					await navigator.clipboard.writeText(jsonToMarkdown(JSON.parse(jsonTasks)));
					break;
			}

			alert(`Copied tasks in format ${exportType} to clipboard.`);
		} catch (err) {
			alert(`Failed to copy: ${err}`);
		}
	};

	let newTaskTitle = '';
</script>

<h1>Tasks</h1>

<section class="flex flex-col gap-4">
	<h2>Create and transfer tasks</h2>
	<div class="flex gap-4">
		<details class="relative">
			<summary class="btn max-w-fit cursor-pointer select-none">New task</summary>
			<div
				class="absolute top-12 flex flex-col gap-4 z-20 p-4 border rounded bg-white border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"
			>
				<h3>Create new task</h3>
				<form action="?/createTodo" method="post" use:enhance class="flex flex-col gap-4">
					<input
						type="hidden"
						id="encryptedTaskTitle"
						name="encryptedTaskTitle"
						value={newTaskTitle}
					/>
					<div class="flex flex-col gap-1 flex-grow">
						<label for="new-task-title">Task</label>
						<input
							name="new-task-title"
							id="new-task-title"
							type="text"
							placeholder="Go out with the dog"
							class="input-common input-text"
							maxlength="255"
							required
							bind:value={newTaskTitle}
						/>
					</div>
					<div class="flex flex-col gap-1">
						<label for="new-task-due-date">Due date</label>
						<input
							name="new-task-due-date"
							id="new-task-due-date"
							type="date"
							class="input-common"
						/>
					</div>
					<div class="flex gap-2">
						<label for="new-task-important-marker">Mark as important</label>
						<input
							name="new-task-important-marker"
							id="new-task-important-marker"
							type="checkbox"
							class="scale-125"
						/>
					</div>
					<button type="submit" class="btn">Create</button>
				</form>
			</div>
			{#if form?.createTitleError}
				<p>
					<small class="text-red-700 dark:text-red-400">The task title cannot be blank.</small>
				</p>
			{/if}
		</details>
		<details class="ms-auto relative">
			<summary class="btn cursor-pointer select-none">Export</summary>
			<div
				class="absolute top-12 max-h-72 overflow-y-auto end-0 flex flex-col gap-4 z-30 p-4 border rounded bg-white border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"
			>
				<h3>Export all tasks</h3>
				<div class="flex items-end gap-2">
					<div class="flex flex-col gap-1 flex-grow">
						<label for="export-tasks-format">Format</label>
						<select
							name="export-tasks-format"
							id="export-tasks-format"
							class="input-common"
							bind:value={exportType}
						>
							<option value="json">JSON</option>
							<option value="csv">CSV</option>
							<option value="markdown">Markdown</option>
						</select>
					</div>
					<button class="btn btn-icon" title="Copy to clipboard" on:click={copyExportTasks}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="w-4 h-4"
						>
							<path
								fill-rule="evenodd"
								d="M11.986 3H12a2 2 0 0 1 2 2v6a2 2 0 0 1-1.5 1.937v-2.523a2.5 2.5 0 0 0-.732-1.768L8.354 5.232A2.5 2.5 0 0 0 6.586 4.5H4.063A2 2 0 0 1 6 3h.014A2.25 2.25 0 0 1 8.25 1h1.5a2.25 2.25 0 0 1 2.236 2ZM10.5 4v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4h3Z"
								clip-rule="evenodd"
							/>
							<path
								d="M3 6a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-3.586a1 1 0 0 0-.293-.707L7.293 6.293A1 1 0 0 0 6.586 6H3Z"
							/>
						</svg>
					</button>
				</div>
			</div>
		</details>
	</div>
</section>
{#if data.allTodos.length !== 0}
	<section class="flex flex-col gap-4">
		<h2>Task list</h2>
		<div class="flex gap-4 flex-wrap mb-2">
			<details class="relative">
				<summary class="btn max-w-fit cursor-pointer select-none">Organise</summary>
				<div
					class="flex flex-col gap-4 p-4 border rounded absolute top-12 z-10 bg-white border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"
				>
					<h3>Organise tasks</h3>
					<form
						method="post"
						action="?/organizeTodos"
						use:enhance={() => {
							$isEditingItem = false;

							return async ({ update }) => {
								update({ reset: false });
							};
						}}
						class="flex flex-col gap-4"
					>
						<OrganizeSelect
							value={data.activeFilter}
							organizeMethod="filter"
							options={['all', 'important', 'active', 'completed']}
						/>
						<OrganizeSelect
							value={data.activeSort}
							organizeMethod="sort"
							options={['creation-date', 'due-date']}
						/>
						<div class="flex gap-2">
							<label for="task-list-group">Group</label>
							<input
								name="task-list-group"
								id="task-list-group"
								type="checkbox"
								class="scale-125"
								checked={data.taskListIsGrouped}
							/>
						</div>
						<button type="submit" class="btn">Apply</button>
					</form>
				</div>
			</details>
			<search>
				<form method="post" action="?/searchTodo" class="flex items-center gap-y-4" use:enhance>
					<div class="flex flex-col gap-2">
						<label for="task-list-search" hidden>Search</label>
						<input
							name="task-list-search"
							id="task-list-search"
							type="search"
							class="input-common rounded-e-none w-32 border-e-0"
							placeholder="Go out"
							value={data.searchTerm}
						/>
					</div>
					<button type="submit" class="btn btn-icon rounded-s-none">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="w-4 h-4"
						>
							<path
								fill-rule="evenodd"
								d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</form>
			</search>
			{#if data.activeFilter === 'completed' && data.todos.length > 0}
				<form method="post" action="?/deleteCompletedTodos" class="ms-auto" use:enhance>
					<button type="submit" class="btn">Delete completed</button>
				</form>
			{/if}
		</div>
		{#if data.todos.length > 0}
			{#if data.taskListIsGrouped}
				{#each data.groupedTodos as { category_name, todos }}
					<section>
						<h3>{category_name}</h3>
						<TodoList
							{todos}
							categories={data.categories}
							updateTitleError={form?.updateTitleError}
							uncategorizedTodos={data.todos}
						/>
					</section>
				{/each}
			{:else}
				<TodoList
					todos={data.todos}
					categories={data.categories}
					updateTitleError={form?.updateTitleError}
					uncategorizedTodos={data.todos}
				/>
			{/if}
		{:else}
			<p>No tasks found!</p>
		{/if}
	</section>
{/if}
