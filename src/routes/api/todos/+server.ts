import { pool } from '$lib/server/lucia';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	const text = 'SELECT * FROM user_todo WHERE user_id = $1';
	const values = [session?.user.userId];

	const res = await pool.query(text, values);

	return json(res.rows);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.validate();

	if (!session) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.json();

	const text = `
        INSERT INTO user_todo (user_id, title, is_completed, is_important, due_date)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *
    `;

	const values = [
		session.user.userId,
		data.title,
		data.is_completed || false,
		data.is_important || false,
		data.due_date || null
	];

	try {
		const res = await pool.query(text, values);
		return json(res.rows[0], { status: 201 });
	} catch (error) {
		console.error(error);
		return json({ message: 'Database error' }, { status: 500 });
	}
};
