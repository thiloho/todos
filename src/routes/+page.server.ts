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
	}
};
