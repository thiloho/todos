import { dev } from '$app/environment';
import { githubAuth } from '$lib/server/lucia';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const [url, state] = await githubAuth.getAuthorizationUrl();

	cookies.set('github_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});
	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};
