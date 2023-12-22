import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { pg } from '@lucia-auth/adapter-postgresql';
import postgres from 'pg';

import { github, google } from '@lucia-auth/oauth/providers';
import { env } from '$env/dynamic/private';

export const pool = new postgres.Pool({
	host: '/run/postgresql',
	user: 'postgres',
	database: 'todos'
});

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: pg(pool, {
		user: 'auth_user',
		key: 'user_key',
		session: 'user_session'
	}),
	getUserAttributes: (data) => {
		return {
			username: data.username,
			authProvider: data.auth_provider
		};
	}
});

export const githubAuth = github(auth, {
	clientId: env.GITHUB_CLIENT_ID,
	clientSecret: env.GITHUB_CLIENT_SECRET
});

export const googleAuth = google(auth, {
	clientId: env.GOOGLE_CLIENT_ID,
	clientSecret: env.GOOGLE_CLIENT_SECRET,
	redirectUri: dev
		? 'http://localhost:5173/login/google/callback'
		: 'https://todos.thilohohlt.com/login/google/callback'
});

export type Auth = typeof auth;
