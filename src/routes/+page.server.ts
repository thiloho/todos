import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { pool } from '$lib/server/lucia';
import { generateFilterQuery, generateSortQuery } from '$lib/utilities';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(302, '/login');
	}

	const text = `
		SELECT * FROM user_todo_organization
		WHERE user_id = $1
	`;

	const values = [session?.user.userId];

	const activeFilter = (await pool.query(text, values)).rows[0].filter;
	const activeSort = (await pool.query(text, values)).rows[0].sort_by;

	const filterQuery = generateFilterQuery(activeFilter);
	const filterSortQuery = generateSortQuery(activeSort, filterQuery);

	const todos = (await pool.query(filterSortQuery, [session?.user.userId])).rows;
	const allTodos = (
		await pool.query(generateSortQuery('', generateFilterQuery('')), [session?.user.userId])
	).rows;

	return { todos, activeFilter, activeSort, allTodos };
};

export const actions: Actions = {
	createTodo: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return fail(401);
		}

		const data = await request.formData();

		const text = `
			INSERT INTO user_todo (user_id, title, is_important, due_date)
			VALUES($1, $2, $3, $4)
			RETURNING *
    	`;

		const values = [
			session.user.userId,
			data.get('new-task-title'),
			data.get('new-task-important-marker') || false,
			data.get('new-task-due-date') || null
		];

		await pool.query(text, values);
	},
	organizeTodos: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return fail(401);
		}

		const data = await request.formData();

		const activeFilter = data.get('task-list-filter');
		const activeSort = data.get('task-list-sort');

		const textFilter = `
			INSERT INTO user_todo_organization (user_id, filter)
			VALUES ($1, $2)
			ON CONFLICT (user_id)
			DO UPDATE SET filter = EXCLUDED.filter;
		`;
		const textSort = `
			INSERT INTO user_todo_organization (user_id, sort_by)
			VALUES ($1, $2)
			ON CONFLICT (user_id)
			DO UPDATE SET sort_by = EXCLUDED.sort_by;
		`;

		const valuesFilter = [session.user.userId, activeFilter];
		const valuesSort = [session.user.userId, activeSort];

		await pool.query(textFilter, valuesFilter);
		await pool.query(textSort, valuesSort);
	},
	deleteCompletedTodos: async ({ locals }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return fail(401);
		}

		const text = `
			DELETE FROM user_todo
			WHERE user_id = $1 AND is_completed = true
		`;

		const values = [session.user.userId];

		await pool.query(text, values);
	},
	updateTodoCompletionState: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return fail(401);
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
			return fail(401);
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
			return fail(401);
		}

		const data = await request.formData();

		const taskId = data.get('taskId');

		const text = `
			DELETE FROM user_todo
			WHERE id = $1 AND user_id = $2
		`;

		const values = [taskId, session.user.userId];

		await pool.query(text, values);
	}
};
