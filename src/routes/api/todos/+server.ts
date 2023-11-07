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
