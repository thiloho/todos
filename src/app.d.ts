/// <reference types="lucia" />
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
	}
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			username: string;
			auth_provider: string;
		};
		type DatabaseSessionAttributes = {};
	}
}

export {};
