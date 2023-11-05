<script lang="ts">
	import Todo from '$lib/components/Todo.svelte';
</script>

<h1>Tasks</h1>
<section class="flex flex-col gap-4">
	<h2>Create a new task</h2>
	<form action="" class="flex items-end flex-wrap gap-4">
		<div class="flex flex-col gap-1 flex-grow">
			<label for="new-task-title">Task</label>
			<input
				id="new-task-title"
				type="text"
				placeholder="Go out with the dog"
				class="input-common input-text"
			/>
		</div>
		<div class="flex flex-col gap-1">
			<label for="new-task-due-date">Due date</label>
			<input id="new-task-due-date" type="date" class="input-common" />
		</div>
		<div class="flex gap-2">
			<label for="new-task-important-marker">Mark as important</label>
			<input id="new-task-important-marker" type="checkbox" class="scale-125" />
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
		<Todo title="Take a walk" />
		<Todo title="Go out with the dog" />
		<Todo title="Write an article about getting started with the Nix ecosystem" />
	</ul>
</section>
