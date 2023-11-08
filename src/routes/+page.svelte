<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;

	// Use :any for now, which is bad practice
	const handleTodoCompletionState = async (event: any, id: number) => {
		const isCompleted = event.target.checked;

		await fetch(`/api/todos/${id}`, {
			method: 'PATCH',
			body: JSON.stringify({ isCompleted }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	};

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
<section class="flex flex-col gap-4">
	<h2>Task list</h2>
	<form action="">
		<div class="flex flex-col gap-1 items-start">
			<label for="task-list-filter">Filter</label>
			<select name="task-list-filter" id="task-list-filter" class="input-common">
				<option value="all">Show all</option>
				<option value="important">Important</option>
				<option value="active">Active</option>
				<option value="completed">Completed</option>
			</select>
		</div>
	</form>
	<ul class="flex flex-col gap-4 mt-4">
		{#if data.session}
			{#each data.todos as { id, title, is_completed, is_important, due_date }}
				<li
					class="ps-4 pe-2 py-2 border border-neutral-200 bg-neutral-100 rounded dark:bg-neutral-800 dark:border-neutral-700"
				>
					<div class="flex flex-wrap gap-2 items-center">
						<input
							{id}
							type="checkbox"
							class="scale-125"
							bind:checked={is_completed}
							on:change={() => handleTodoCompletionState(event, id)}
						/>
						<label for={id} class:line-through={is_completed} class:opacity-50={is_completed}
							>{title}</label
						>
						<button
							title="Edit task"
							on:click={() => handleTaskEditing(id, title, is_important, due_date)}
							class="btn btn-icon ms-auto bg-neutral-200 border-neutral-300 dark:bg-neutral-700 dark:border-neutral-600"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-5 h-5"
							>
								<path
									d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"
								/>
								<path
									d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"
								/>
							</svg>
						</button>
					</div>
					<div class="flex flex-wrap items-end gap-4">
						{#if is_important}
							<p>
								<small class="flex gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="w-5 h-5 text-red-900 dark:text-red-400"
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
								<small
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
		{/if}
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
				<h2>Edit todo</h2>
				<form
					action="?/updateTodo"
					method="post"
					use:enhance={() => {
						return async ({ update }) => {
							update({ reset: false });
						};
					}}
					class="flex flex-col gap-4"
				>
					<div class="flex flex-col gap-1 flex-grow">
						<label for="edit-task-{editingId}-title">Task</label>
						<input
							bind:value={editingTitle}
							name="edit-task-{editingId}-title"
							id="edit-task-{editingId}-title"
							type="text"
							placeholder="Go out with the dog"
							class="input-common input-text"
							required
						/>
					</div>
					<div class="flex flex-col gap-1">
						<label for="edit-task-{editingId}-due-date">Due date</label>
						<input
							bind:value={editingDueDate}
							name="edit-task-{editingId}-due-date"
							id="edit-task-{editingId}-due-date"
							type="date"
							class="input-common"
						/>
					</div>
					<div class="flex gap-2">
						<label for="edit-task-{editingId}-important-marker">Mark as important</label>
						<input
							bind:checked={editingIsImportant}
							name="edit-task-{editingId}-important-marker"
							id="edit-task-{editingId}-important-marker"
							type="checkbox"
							class="scale-125"
						/>
					</div>
					<button type="submit" class="btn">Update</button>
				</form>
			</div>
		{/if}
	</ul>
</section>
