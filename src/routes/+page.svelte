<script lang="ts">
	import Todo from '$lib/components/Todo.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Tasks</h1>
<section class="flex flex-col gap-4">
	<h2>Create a new task</h2>
	<form action="?/createTodo" method="post" class="flex items-end flex-wrap gap-4">
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
			{#each data.todos as todo, i}
				<Todo taskId="task-{i}" title={todo.title} />
			{/each}
		{/if}
	</ul>
</section>
