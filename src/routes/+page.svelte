<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import OrganizeSelect from '$lib/components/OrganizeSelect.svelte';
	import TodoList from '$lib/components/TodoList.svelte';

	export let data: PageData;

	export let form: ActionData;
</script>

<h1>Tasks</h1>
<section class="flex flex-col gap-4">
	<h2>Create a new task</h2>
	<form action="?/createTodo" method="post" use:enhance class="flex items-end flex-wrap gap-4">
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
		<button type="submit" class="btn">Create</button>
	</form>
	{#if form?.createTitleError}
		<p>
			<small class="text-red-900 dark:text-red-400">The task title cannot be blank.</small>
		</p>
	{/if}
</section>
{#if data.allTodos.length !== 0}
	<section class="flex flex-col gap-4">
		<h2>Task list</h2>
		<div class="flex flex-wrap gap-8 items-end">
			<form
				method="post"
				action="?/organizeTodos"
				use:enhance={() => {
					return async ({ update }) => {
						update({ reset: false });
					};
				}}
				class="flex items-end flex-wrap gap-4"
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
			{#if data.activeFilter === 'completed' && data.todos.length > 0}
				<form method="post" action="?/deleteCompletedTodos" class="ms-auto" use:enhance>
					<button type="submit" class="btn">Delete completed tasks</button>
				</form>
			{/if}
		</div>
		{#if data.todos.length > 0}
			{#if data.taskListIsGrouped}
				{#each data.groupedTodos as { category_name, category_id, todos }}
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
			<p>You have no {data.activeFilter} tasks!</p>
		{/if}
	</section>
{/if}
