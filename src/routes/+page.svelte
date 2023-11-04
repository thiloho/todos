<h1 class="text-2xl font-bold">Tasks</h1>
<section class="flex flex-col gap-4">
	<h2 class="text-xl border-b border-neutral-200 pb-1">Create a new task</h2>
	<form action="" class="flex items-end flex-wrap gap-4">
		<div class="flex flex-col gap-1 flex-grow">
			<label for="new-task-title">Task</label>
			<input
				id="new-task-title"
				type="text"
				placeholder="Go out with the dog"
				class="border-b border-black ps-2 pe-2 py-1"
			/>
		</div>
		<div class="flex flex-col gap-1">
			<label for="new-task-due-date">Due date</label>
			<input id="new-task-due-date" type="date" />
		</div>
		<div class="flex gap-2">
			<label for="new-task-important-marker">Mark as important</label>
			<input id="new-task-important-marker" type="checkbox" class="scale-125" />
		</div>
		<button
			type="submit"
			class="ps-2 pe-2 py-1 bg-neutral-100 border rounded border-neutral-200 text-blue-900 hover:underline hover:text-blue-950"
			>Create</button
		>
	</form>
</section>
<section class="flex flex-col gap-4">
	<h2 class="text-xl border-b border-neutral-200 pb-1">Task list</h2>
	<form action="">
		<div class="flex flex-col gap-1 items-start">
			<label for="task-list-filter">Filter</label>
			<select
				name="task-list-filter"
				id="task-list-filter"
				class="ps-2 pe-2 py-1 bg-neutral-100 border border-neutral-200 rounded text-blue-900"
			>
				<option value="all">Show all</option>
				<option value="important">Important</option>
				<option value="active">Active</option>
				<option value="completed">Completed</option>
			</select>
		</div>
	</form>
	<ul class="flex flex-col gap-4 mt-4">
		<li
			class="ps-4 pe-2 py-2 border border-neutral-200 bg-neutral-100 rounded flex gap-2 items-center"
		>
			<input id="task-1" type="checkbox" class="scale-125" />
			<label for="task-1">Take a walk</label>
			<button
				title="Edit task"
				class="p-2 rounded border border-neutral-300 bg-neutral-200 ms-auto text-blue-900 hover:scale-105"
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
		</li>
		<li
			class="ps-4 pe-2 py-2 border border-neutral-200 bg-neutral-100 rounded flex gap-2 items-center"
		>
			<input id="task-2" type="checkbox" class="scale-125" />
			<label for="task-2">Go out with the dog</label>
			<button
				title="Edit task"
				class="p-2 rounded border border-neutral-300 bg-neutral-200 ms-auto text-blue-900 hover:scale-105"
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
		</li>
		<li
			class="ps-4 pe-2 py-2 border border-neutral-200 bg-neutral-100 rounded flex gap-2 items-center"
		>
			<input id="task-3" type="checkbox" class="scale-125" />
			<label for="task-3">Write an article about getting started with the Nix ecosystem</label>
			<button
				title="Edit task"
				class="p-2 rounded border border-neutral-300 bg-neutral-200 ms-auto text-blue-900 hover:scale-105"
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
		</li>
	</ul>
</section>
