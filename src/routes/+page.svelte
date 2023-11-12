<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import OrganizeSelect from '$lib/components/OrganizeSelect.svelte';

	export let data: PageData;

	let isEditingItem = false;
	let editingId: number, editingTitle: string, editingIsImportant: boolean, editingDueDate: string;

	const handleTaskEditing = (id: number, title: string, is_important: boolean, due_date: Date) => {
		isEditingItem = true;

		editingId = id;
		editingTitle = title;
		editingIsImportant = is_important;
		editingDueDate = due_date ? new Date(due_date).toISOString().split('T')[0] : '';
	};
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
				minlength="10"
				pattern="\S(.*\S)?"
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
				<button type="submit" class="btn">Apply</button>
			</form>
			{#if data.activeFilter === 'completed' && data.todos.length > 0}
				<form method="post" action="?/deleteCompletedTodos" class="ms-auto" use:enhance>
					<button type="submit" class="btn">Delete completed tasks</button>
				</form>
			{/if}
		</div>
		{#if data.session && data.todos.length > 0}
			<ul class="flex flex-col gap-4 mt-4">
				{#each data.todos as { id, title, is_completed, is_important, due_date }}
					<li
						class="ps-2 pe-2 py-2 border border-neutral-200 bg-neutral-100 rounded dark:bg-neutral-800 dark:border-neutral-700"
					>
						<div class="flex flex-wrap gap-2 items-center">
							<form method="post" action="?/updateTodoCompletionState" use:enhance>
								<input type="hidden" id="taskId" name="taskId" value={id} />
								<input type="hidden" id="isCompleted" name="isCompleted" value={is_completed} />
								<button
									type="submit"
									class="btn btn-icon btn-icon-sm text-white"
									class:bg-green-900={is_completed}
									class:dark:!bg-green-500={is_completed}
								>
									{#if is_completed}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-5 h-5"
										>
											<path
												fill-rule="evenodd"
												d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
												clip-rule="evenodd"
											/>
										</svg>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-5 h-5 text-black dark:text-white"
										>
											<path
												fill-rule="evenodd"
												d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
												clip-rule="evenodd"
											/>
										</svg>
									{/if}
								</button>
							</form>
							<button
								class:opacity-50={is_completed}
								class:line-through={is_completed}
								class="flex-grow text-start"
								on:click={() => handleTaskEditing(id, title, is_important, due_date)}
							>
								{title}
							</button>
						</div>
						<div
							class="flex flex-wrap items-center gap-x-4 gap-y-0"
							class:mt-2={is_important || due_date}
						>
							{#if is_important}
								<p>
									<small class="flex items-center gap-1">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-5 h-5 text-red-900 dark:text-red-500"
										>
											<path
												fill-rule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
												clip-rule="evenodd"
											/>
										</svg>
										<strong>Important</strong>
									</small>
								</p>
							{/if}
							{#if due_date}
								<p>
									<small class="flex gap-1 items-center"
										>Due
										<time datetime={due_date} class="italic"
											>{new Intl.DateTimeFormat('en-US', {
												weekday: 'short',
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											}).format(new Date(due_date))}</time
										>
									</small>
								</p>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
			{#if isEditingItem}
				<div
					class="fixed end-0 top-0 border-s border-neutral-200 bg-white p-4 h-full w-[min(theme(width.96),theme(width.3/4))] flex flex-col gap-4 dark:bg-neutral-900 dark:border-neutral-800"
				>
					<button
						title="Close sidebar"
						on:click={() => (isEditingItem = false)}
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
					<h3>Edit todo (id {editingId})</h3>
					<form
						id="update-todo"
						action="?/updateTodo"
						method="post"
						use:enhance={() => {
							return async ({ update }) => {
								update({ reset: false });
							};
						}}
						class="flex flex-col gap-4"
					>
						<div class="flex flex-col gap-1">
							<label for="edit-task-{editingId}-title">Task</label>
							<input
								name="edit-task-{editingId}-title"
								id="edit-task-{editingId}-title"
								class="input-common input-text"
								value={editingTitle}
								maxlength="255"
								minlength="10"
								pattern="\S(.*\S)?"
								required
							/>
						</div>
						<div class="flex flex-col gap-1">
							<label for="edit-task-{editingId}-due-date">Due date</label>
							<input
								value={editingDueDate}
								name="edit-task-{editingId}-due-date"
								id="edit-task-{editingId}-due-date"
								type="date"
								class="input-common"
							/>
						</div>
						<div class="flex gap-2">
							<label for="edit-task-{editingId}-important-marker">Mark as important</label>
							<input
								checked={editingIsImportant}
								name="edit-task-{editingId}-important-marker"
								id="edit-task-{editingId}-important-marker"
								type="checkbox"
								class="scale-125"
							/>
						</div>
						<button type="submit" class="btn">Update</button>
						<form
							action="?/deleteTodo"
							method="post"
							use:enhance={() => {
								isEditingItem = false;
							}}
						>
							<input type="hidden" id="taskId" name="taskId" value={editingId} />
							<button class="btn btn-icon" title="Delete todo">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-5 h-5"
								>
									<path
										fill-rule="evenodd"
										d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						</form>
					</form>
				</div>
			{/if}
		{:else}
			<p>You have no {data.activeFilter} tasks!</p>
		{/if}
	</section>
{/if}
