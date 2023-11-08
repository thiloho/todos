<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
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
			<div class="flex flex-col gap-1 items-start">
				<label for="task-list-filter">Filter</label>
				<select
					name="task-list-filter"
					id="task-list-filter"
					class="input-common"
					value={data.activeFilter}
				>
					<option value="all">Show all</option>
					<option value="important">Important</option>
					<option value="active">Active</option>
					<option value="completed">Completed</option>
				</select>
			</div>
			<div class="flex flex-col gap-1 items-start">
				<label for="task-list-sort">Sort</label>
				<select
					name="task-list-sort"
					id="task-list-sort"
					class="input-common"
					value={data.activeSort}
				>
					<option value="creation">Creation date</option>
					<option value="due-date">Due date</option>
				</select>
			</div>
			<button type="submit" class="btn">Apply</button>
		</form>
		<form method="post" action="?/deleteCompletedTodos" class="ms-auto" use:enhance>
			<button type="submit" class="btn">Delete completed tasks</button>
		</form>
	</div>
	{#if data.todos.length > 0}
		<ul class="flex flex-col gap-4 mt-4">
			{#if data.session}
				{#each data.todos as { id, title, is_completed, is_important, due_date }}
					{@const dueDateInput = due_date ? new Date(due_date).toISOString().split('T')[0] : ''}
					<li
						class="ps-4 pe-2 py-2 border border-neutral-200 bg-neutral-100 rounded dark:bg-neutral-800 dark:border-neutral-700"
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
							<p class:opacity-50={is_completed} class:line-through={is_completed}>{title}</p>
							<details class="ms-auto relative">
								<summary
									title="Edit task"
									class="btn btn-icon block bg-neutral-200 cursor-pointer border-neutral-300 dark:bg-neutral-700 dark:border-neutral-600"
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
								</summary>
								<div
									class="absolute end-0 top-12 z-10 border border-neutral-200 rounded bg-white p-4 flex flex-col gap-4 dark:bg-neutral-900 dark:border-neutral-800"
								>
									<h3>Edit todo</h3>
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
										<div class="flex flex-col gap-1 flex-grow">
											<label for="edit-task-{id}-title">Task</label>
											<input
												value={title}
												name="edit-task-{id}-title"
												id="edit-task-{id}-title"
												type="text"
												placeholder="Go out with the dog"
												class="input-common input-text"
												required
											/>
										</div>
										<div class="flex flex-col gap-1">
											<label for="edit-task-{id}-due-date">Due date</label>
											<input
												value={dueDateInput}
												name="edit-task-{id}-due-date"
												id="edit-task-{id}-due-date"
												type="date"
												class="input-common"
											/>
										</div>
										<div class="flex gap-2">
											<label for="edit-task-{id}-important-marker">Mark as important</label>
											<input
												checked={is_important}
												name="edit-task-{id}-important-marker"
												id="edit-task-{id}-important-marker"
												type="checkbox"
												class="scale-125"
											/>
										</div>
										<button type="submit" class="btn">Update</button>
										<button formaction="?/deleteTodo" class="btn btn-icon ms-auto">
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
							</details>
						</div>
						<div class="flex flex-wrap items-end gap-x-4 gap-y-0">
							{#if is_important}
								<p>
									<small class="flex gap-1">
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
		</ul>
	{:else}
		<p>You currently have no tasks!</p>
	{/if}
</section>
