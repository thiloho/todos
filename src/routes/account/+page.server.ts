import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) redirect(302, '/login');
	return {
		userId: session?.user.userId,
		username: session?.user.username,
		authProvider: session?.user.authProvider
	};
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.validateSession(session.sessionId);
		locals.auth.setSession(null);
		redirect(302, '/login');
	},
	deleteAccount: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.deleteUser(session.user.userId);
		redirect(302, '/login');
	}
};
