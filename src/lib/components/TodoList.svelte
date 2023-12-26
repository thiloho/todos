<script lang="ts">
	type Task = {
		id: number;
		user_id: string;
		title: string;
		is_completed: boolean;
		is_important: boolean;
		due_date: string | null;
		created_at: string;
		updated_at: string;
		category_id: number | null;
		is_overdue: boolean;
	};

	type Category = {
		id: number;
		name: string;
		color_light: string;
		color_dark: string;
	};

	export let todos: Task[];
	export let updateTitleError = false;
	export let categories: Category[];
	export let uncategorizedTodos: Task[];

	import DateFormat from '$lib/components/DateFormat.svelte';
	import { enhance } from '$app/forms';
	import {
		isEditingItem,
		editingId,
		editingTitle,
		editingIsImportant,
		editingDueDate
	} from '$lib/stores';

	const handleTaskEditing = (
		id: number,
		title: string,
		is_important: boolean,
		due_date: string | null
	) => {
		$isEditingItem = true;

		$editingId = id;
		$editingTitle = title;
		$editingIsImportant = is_important;
		$editingDueDate = due_date ? new Date(due_date).toISOString().split('T')[0] : '';
	};
</script>

<ul class="flex flex-col gap-4 mt-4">
	{#each todos as { id, title, is_completed, is_important, due_date, category_id, is_overdue }}
		<li
			class="ps-2 pe-2 py-2 border border-neutral-200 bg-neutral-100 rounded dark:bg-neutral-800 dark:border-neutral-700"
		>
			<div class="flex gap-2 items-center flex-wrap">
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
				class:mt-2={is_important || due_date || category_id}
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
						<small class="flex gap-1 items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-5 h-5"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
									clip-rule="evenodd"
								/>
							</svg>
							{#if is_overdue}
								<span class="underline text-red-900 dark:text-red-400">Overdue</span>
							{/if}
							<DateFormat dateString={due_date} />
						</small>
					</p>
				{/if}
				{#if category_id}
					<p>
						<small class="flex items-center gap-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-5 h-5 text-[--light-text] dark:text-[--dark-text]"
								style="--dark-text: {categories.find((category) => category.id === category_id)
									?.color_dark}; --light-text: {categories.find(
									(category) => category.id === category_id
								)?.color_light}"
							>
								<path
									fill-rule="evenodd"
									d="M5.5 3A2.5 2.5 0 003 5.5v2.879a2.5 2.5 0 00.732 1.767l6.5 6.5a2.5 2.5 0 003.536 0l2.878-2.878a2.5 2.5 0 000-3.536l-6.5-6.5A2.5 2.5 0 008.38 3H5.5zM6 7a1 1 0 100-2 1 1 0 000 2z"
									clip-rule="evenodd"
								/>
							</svg>
							{categories.find((category) => category.id === category_id)?.name}
						</small>
					</p>
				{/if}
			</div>
		</li>
	{/each}
</ul>

{#if $isEditingItem}
	<div
		class="fixed z-40 end-0 top-0 border-s border-neutral-200 bg-white p-4 h-full w-[min(theme(width.96),theme(width.3/4))] flex flex-col gap-4 dark:bg-neutral-900 dark:border-neutral-800 overflow-y-auto"
	>
		<button
			title="Close sidebar"
			on:click={() => ($isEditingItem = false)}
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
		<h3>Edit todo (id {$editingId})</h3>
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
				<label for="edit-task-{$editingId}-title">Task</label>
				<input
					name="edit-task-{$editingId}-title"
					id="edit-task-{$editingId}-title"
					class="input-common input-text"
					value={$editingTitle}
					maxlength="255"
					required
				/>
			</div>
			<div class="flex flex-col gap-1">
				<label for="edit-task-{$editingId}-due-date">Due date</label>
				<input
					value={$editingDueDate}
					name="edit-task-{$editingId}-due-date"
					id="edit-task-{$editingId}-due-date"
					type="date"
					class="input-common"
				/>
			</div>
			<div class="flex gap-2">
				<label for="edit-task-{$editingId}-important-marker">Mark as important</label>
				<input
					bind:checked={$editingIsImportant}
					name="edit-task-{$editingId}-important-marker"
					id="edit-task-{$editingId}-important-marker"
					type="checkbox"
					class="scale-125"
				/>
			</div>
			<div class="flex flex-col gap-1 items-start">
				<label for="edit-task-{$editingId}-category">Category</label>
				<select
					name="edit-task-{$editingId}-category"
					id="edit-task-{$editingId}-category"
					class="input-common"
					value={uncategorizedTodos.find((todo) => todo.id === $editingId)?.category_id || ''}
				>
					<option value="">None</option>
					{#each categories.map((category) => category.id) as option}
						<option value={option}
							>{categories.find((category) => category.id === option)?.name}</option
						>
					{/each}
				</select>
			</div>
			<button type="submit" class="btn">Update</button>
		</form>
		{#if updateTitleError}
			<p>
				<small class="text-red-900 dark:text-red-400">The task title cannot be blank.</small>
			</p>
		{/if}
		<ul class="mt-auto">
			<li>
				Created at: <DateFormat
					dateString={uncategorizedTodos.find((todo) => todo.id === $editingId)?.created_at || ''}
					withTime={true}
				/>
			</li>
			<li>
				Updated at: <DateFormat
					dateString={uncategorizedTodos.find((todo) => todo.id === $editingId)?.updated_at || ''}
					withTime={true}
				/>
			</li>
		</ul>
		<form
			action="?/deleteTodo"
			method="post"
			use:enhance={() => {
				$isEditingItem = false;
			}}
			class="ms-auto"
		>
			<input type="hidden" id="taskId" name="taskId" value={$editingId} />
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
	</div>
{/if}
