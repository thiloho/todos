import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { pool } from '$lib/server/lucia';
import {
	generateFilterQuery,
	generateSortQuery,
	generateSearchQuery,
	isOverdue
} from '$lib/utilities';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		redirect(302, '/login');
	}

	const text = `
		SELECT * FROM user_todo_organization
		WHERE user_id = $1
	`;

	const values = [session?.user.userId];

	const activeFilter = (await pool.query(text, values)).rows[0].filter;
	const activeSort = (await pool.query(text, values)).rows[0].sort_by;
	const searchTerm = (await pool.query(text, values)).rows[0].search_term;

	const filterQuery = generateFilterQuery(activeFilter);
	const filterSortQuery = generateSortQuery(activeSort, filterQuery);
	const searchSortQuery = generateSearchQuery(searchTerm, filterSortQuery);

	const todos = (await pool.query(searchSortQuery, [session?.user.userId])).rows;
	const allTodos = (
		await pool.query(generateSortQuery('', generateFilterQuery('')), [session?.user.userId])
	).rows;

	const categories = (await pool.query('SELECT * FROM todo_category')).rows;

	const taskListIsGrouped = (
		await pool.query('SELECT is_grouped from user_todo_organization WHERE user_id = $1', [
			session?.user.userId
		])
	).rows[0].is_grouped;

	const groupedText = `
		SELECT 
			COALESCE(c.name, 'Uncategorized') AS category_name,
			c.id AS category_id,
			COALESCE(c.color_light, '#000000') AS color_light,
			COALESCE(c.color_dark, '#ffffff') AS color_dark,
			json_agg(
				json_build_object(
					'id', t.id,
					'user_id', t.user_id,
					'title', t.title,
					'is_completed', t.is_completed,
					'is_important', t.is_important,
					'due_date', t.due_date,
					'created_at', t.created_at,
					'updated_at', t.updated_at,
					'category_id', t.category_id,
					'is_overdue', t.is_overdue
				)
				${generateSortQuery(activeSort)}
			) AS todos
		FROM 
			(
				${generateSearchQuery(searchTerm, generateFilterQuery(activeFilter))}
			) AS t
		LEFT JOIN 
			todo_category AS c ON t.category_id = c.id
		WHERE 
			t.user_id = $1
		GROUP BY 
			category_name, color_light, color_dark, c.id
		ORDER BY 
			CASE WHEN c.id IS NULL THEN 1 ELSE 0 END, 
			c.id;
	`;

	const groupedTodos = (await pool.query(groupedText, [session?.user.userId])).rows;

	return {
		todos,
		activeFilter,
		activeSort,
		allTodos,
		categories,
		taskListIsGrouped,
		groupedTodos,
		searchTerm
	};
};

export const actions: Actions = {
	createTodo: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return fail(401);
		}

		const data = await request.formData();

		const taskTitle = data.get('new-task-title') as string;
		const dueDate = (data.get('new-task-due-date') as string) || null;

		if (taskTitle.trim().length === 0) {
			return { createTitleError: true };
		}

		const text = `
			INSERT INTO user_todo (user_id, title, is_important, due_date, is_overdue)
			VALUES($1, $2, $3, $4, $5)
			RETURNING *
    	`;

		const values = [
			session.user.userId,
			taskTitle.replace(/\s+/g, ' ').trim(),
			data.get('new-task-important-marker') || false,
			dueDate,
			isOverdue(dueDate)
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
		const isGrouped = data.get('task-list-group');

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
		const groupedText = `
			INSERT INTO user_todo_organization (user_id, is_grouped)
			VALUES ($1, $2)
			ON CONFLICT (user_id)
			DO UPDATE SET is_grouped = EXCLUDED.is_grouped
		`;

		const valuesFilter = [session.user.userId, activeFilter];
		const valuesSort = [session.user.userId, activeSort];
		const valuesGroup = [session.user.userId, isGrouped || false];

		await pool.query(textFilter, valuesFilter);
		await pool.query(textSort, valuesSort);
		await pool.query(groupedText, valuesGroup);
	},
	searchTodo: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return fail(401);
		}

		const data = await request.formData();
		const searchText = data.get('task-list-search');

		const text = `
			INSERT INTO user_todo_organization (user_id, search_term)
			VALUES ($1, $2)
			ON CONFLICT (user_id)
			DO UPDATE SET search_term = EXCLUDED.search_term
		`;
		const values = [session.user.userId, searchText];

		await pool.query(text, values);
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

		const title = data.get(`edit-task-${editingId}-title`) as string;

		if (title.trim().length === 0) {
			return { updateTitleError: true };
		}

		const dueDate = (data.get(`edit-task-${editingId}-due-date`) as string) || null;
		const isImportant = data.get(`edit-task-${editingId}-important-marker`);
		const category = data.get(`edit-task-${editingId}-category`);

		const text = `
			UPDATE user_todo
			SET title = $1,
				due_date = $2,
				is_important = $3,
				category_id = $4,
				is_overdue = $5,
				updated_at = CURRENT_TIMESTAMP
			WHERE id = $6 AND user_id = $7
		`;

		const values = [
			title.replace(/\s+/g, ' ').trim(),
			dueDate,
			isImportant || false,
			category || null,
			isOverdue(dueDate),
			editingId,
			session.user.userId
		];

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
