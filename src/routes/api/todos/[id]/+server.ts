import { pool } from "$lib/server/lucia";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	const { isCompleted } = await request.json();
	const session = await locals.auth.validate();

	if (!session) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	const text = `
		UPDATE user_todo
		SET is_completed = $1
		WHERE id = $2 AND user_id = $3
	`;

	const values = [
		isCompleted,
		params.id,
		session.user.userId
	];

	await pool.query(text, values);

    return new Response(null, { status: 204 });
}