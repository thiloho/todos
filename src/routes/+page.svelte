<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import OrganizeSelect from '$lib/components/OrganizeSelect.svelte';
	import TodoList from '$lib/components/TodoList.svelte';
	import { isEditingItem } from '$lib/stores';

	export let data: PageData;

	export let form: ActionData;
</script>

<h1>Tasks</h1>

<section class="flex flex-col gap-4">
	<h2>Create task</h2>
	<details class="relative">
		<summary class="btn max-w-fit cursor-pointer">New task</summary>
		<div
			class="absolute top-12 flex flex-col gap-4 z-20 p-4 border rounded bg-white border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"
		>
			<h2>Create new task</h2>
			<form action="?/createTodo" method="post" use:enhance class="flex flex-col gap-4">
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
					/>
				</div>
				<div class="flex flex-col gap-1">
					<label for="new-task-due-date">Due date</label>
					<input name="new-task-due-date" id="new-task-due-date" type="date" class="input-common" />
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
				<button type="submit" class="btn w-full">Create</button>
			</form>
		</div>
		{#if form?.createTitleError}
			<p>
				<small class="text-red-700 dark:text-red-400">The task title cannot be blank.</small>
			</p>
		{/if}
	</details>
</section>
{#if data.allTodos.length !== 0}
	<section class="flex flex-col gap-4">
		<h2>Task list</h2>
		<div class="flex gap-4 flex-wrap mb-2">
			<details class="relative">
				<summary class="btn max-w-fit cursor-pointer">Organise</summary>
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
