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

		console.log(data);
	}
};
