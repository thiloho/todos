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
						class="btn btn-icon text-white"
						class:bg-green-400={is_completed}
						class:bg-neutral-400={!is_completed}
						class:dark:bg-green-700={is_completed}
						class:dark:bg-neutral-700={!is_completed}
					>
						{#if is_completed}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								class="w-4 h-4"
							>
								<path
									fill-rule="evenodd"
									d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z"
									clip-rule="evenodd"
								/>
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								class="w-4 h-4"
							>
								<path
									fill-rule="evenodd"
									d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm4-7a.75.75 0 0 0-.75-.75h-6.5a.75.75 0 0 0 0 1.5h6.5A.75.75 0 0 0 12 8Z"
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
					<div class="flex gap-1 items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="w-4 h-4 text-red-700 dark:text-red-400"
						>
							<path
								fill-rule="evenodd"
								d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
								clip-rule="evenodd"
							/>
						</svg>

						<p class="flex">
							<small>
								<strong>Important</strong>
							</small>
						</p>
					</div>
				{/if}
				{#if due_date}
					<div class="flex gap-1 items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="w-4 h-4"
						>
							<path
								fill-rule="evenodd"
								d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z"
								clip-rule="evenodd"
							/>
						</svg>
						<p>
							<small class="flex gap-1 items-center">
								{#if is_overdue}
									<span class="underline text-red-700 dark:text-red-400">Overdue</span>
								{/if}
								<DateFormat dateString={due_date} />
							</small>
						</p>
					</div>
				{/if}
				{#if category_id}
					<div class="flex gap-1 items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="w-4 h-4 text-[--light-text] dark:text-[--dark-text]"
							style="--dark-text: {categories.find((category) => category.id === category_id)
								?.color_dark}; --light-text: {categories.find(
								(category) => category.id === category_id
							)?.color_light}"
						>
							<path
								fill-rule="evenodd"
								d="M7.487 2.89a.75.75 0 1 0-1.474-.28l-.455 2.388H3.61a.75.75 0 0 0 0 1.5h1.663l-.571 2.998H2.75a.75.75 0 0 0 0 1.5h1.666l-.403 2.114a.75.75 0 0 0 1.474.28l.456-2.394h2.973l-.403 2.114a.75.75 0 0 0 1.474.28l.456-2.394h1.947a.75.75 0 0 0 0-1.5h-1.661l.57-2.998h1.95a.75.75 0 0 0 0-1.5h-1.664l.402-2.108a.75.75 0 0 0-1.474-.28l-.455 2.388H7.085l.402-2.108ZM6.8 6.498l-.571 2.998h2.973l.57-2.998H6.8Z"
								clip-rule="evenodd"
							/>
						</svg>
						<p class="flex">
							<small>
								{categories.find((category) => category.id === category_id)?.name}
							</small>
						</p>
					</div>
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
				viewBox="0 0 16 16"
				fill="currentColor"
				class="w-4 h-4"
			>
				<path
					d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"
				/>
			</svg>
		</button>
		<h3>Edit task</h3>
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
				<small class="text-red-700 dark:text-red-400">The task title cannot be blank.</small>
			</p>
		{/if}
		<ul class="mt-auto">
			<li>
				Created at: <strong
					><DateFormat
						dateString={uncategorizedTodos.find((todo) => todo.id === $editingId)?.created_at || ''}
						withTime={true}
					/></strong
				>
			</li>
			<li>
				Updated at: <strong
					><DateFormat
						dateString={uncategorizedTodos.find((todo) => todo.id === $editingId)?.updated_at || ''}
						withTime={true}
					/></strong
				>
			</li>
			<li>
				Id: <strong>{$editingId}</strong>
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
					viewBox="0 0 16 16"
					fill="currentColor"
					class="w-4 h-4"
				>
					<path
						fill-rule="evenodd"
						d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</form>
	</div>
{/if}
