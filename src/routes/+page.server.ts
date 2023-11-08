import type { Actions, PageServerLoad } from './$types';
import { json } from '@sveltejs/kit';
import { pool } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/todos');
	const todos = await response.json();

	return { todos };
};

export const actions: Actions = {
	createTodo: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return json({ message: 'Unauthorized' }, { status: 401 });
		}

		const data = await request.formData();

		const text = `
			INSERT INTO user_todo (user_id, title, is_important, due_date)
			VALUES($1, $2, $3, $4)
			RETURNING *
    	`;

		const values = [
			session.user.userId,
			data.get('new-task-title') || 'This is just a simple test',
			data.get('new-task-important-marker') || false,
			data.get('new-task-due-date') || null
		];

		await pool.query(text, values);
	},
	filterTodos: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return json({ message: 'Unauthorized' }, { status: 401 });
		}

		const data = await request.formData();

		const activeFilter = data.get('task-list-filter');

		let text: string;

		switch (activeFilter) {
			case 'important':
				text = `
					SELECT * FROM user_todo
					WHERE is_important = true AND user_id = $1
					ORDER BY id DESC
				`;
				break;
			case 'active':
				text = `
					SELECT * FROM user_todo
					WHERE is_completed = false AND user_id = $1
					ORDER BY id DESC
				`;
				break;
			case 'completed':
				text = `
					SELECT * FROM user_todo
					WHERE is_completed = true AND user_id = $1
					ORDER BY id DESC
				`;
				break;
			default:
				text = `
					SELECT * FROM user_todo
					WHERE user_id = $1
					ORDER BY id DESC
				`;
				break;
		}

		const values = [session.user.userId];

		const res = await pool.query(text, values);

		return { todos: res.rows };
	},
	updateTodoCompletionState: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return json({ message: 'Unauthorized' }, { status: 401 });
		}

		const data = await request.formData();

		const taskId = data.get('taskId');
		const isCompleted = data.get('isCompleted') === 'true';

		const text = `
			UPDATE user_todo
			SET is_completed = $1,
				updated_at = CURRENT_TIMESTAMP
			WHERE id = $2 AND user_id = $3
		`;

		const values = [!isCompleted, taskId, session.user.userId];

		await pool.query(text, values);
	},
	updateTodo: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return json({ message: 'Unauthorized' }, { status: 401 });
		}

		const data = await request.formData();

		const taskField = Array.from(data.keys()).find((key) => key.startsWith('edit-task-'));
		const editingId = taskField?.split('-')[2];

		const title = data.get(`edit-task-${editingId}-title`);
		const dueDate = data.get(`edit-task-${editingId}-due-date`);
		const isImportant = data.get(`edit-task-${editingId}-important-marker`);

		const text = `
			UPDATE user_todo
			SET title = $1,
				due_date = $2,
				is_important = $3,
				updated_at = CURRENT_TIMESTAMP
			WHERE id = $4 AND user_id = $5
		`;

		const values = [title, dueDate || null, isImportant || false, editingId, session.user.userId];

		await pool.query(text, values);
	},
	deleteTodo: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return json({ message: 'Unauthorized' }, { status: 401 });
		}

		const data = await request.formData();

		const taskField = Array.from(data.keys()).find((key) => key.startsWith('edit-task-'));
		const taskId = taskField?.split('-')[2];

		const text = `
			DELETE FROM user_todo
			WHERE id = $1 AND user_id = $2
		`;

		const values = [taskId, session.user.userId];

		await pool.query(text, values);
	}
};
