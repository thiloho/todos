<script lang="ts">
	import { enhance } from '$app/forms';
	import Notification from '$lib/components/Notification.svelte';
	import type { PageData } from './$types';
	import { generateAndExportSecretKey, generateKeyHash } from '$lib/utilities';

	export let data: PageData;
</script>

<h1>Account</h1>

<section class="flex flex-col gap-4" id="overview">
	<h2>User information</h2>

	<ul class="flex flex-col gap-2">
		<li>Provider: <strong>{data.authProvider}</strong></li>
		<li>User id: <strong>{data.userId}</strong></li>
		<li>Username: <strong>{data.username}</strong></li>
	</ul>

	<form method="post" action="?/logout" use:enhance>
		<button type="submit" class="btn">Log out</button>
	</form>
</section>

<section class="flex flex-col gap-4" id="encryption">
	<h2>Encryption</h2>
	<Notification
		type="info"
		text="If you do not want your tasks to be stored in clear text on the server, you can enable encryption for an extra layer of privacy."
	/>
	<details>
		<summary class="btn max-w-fit cursor-pointer select-none">Enable encryption</summary>
		<div class="flex flex-col gap-4 mt-4">
			<div class="flex gap-2 flex-wrap items-end">
				<button class="btn btn-icon self-start" title="Copy password to clipboard">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="w-4 h-4"
					>
						<path
							fill-rule="evenodd"
							d="M11.986 3H12a2 2 0 0 1 2 2v6a2 2 0 0 1-1.5 1.937v-2.523a2.5 2.5 0 0 0-.732-1.768L8.354 5.232A2.5 2.5 0 0 0 6.586 4.5H4.063A2 2 0 0 1 6 3h.014A2.25 2.25 0 0 1 8.25 1h1.5a2.25 2.25 0 0 1 2.236 2ZM10.5 4v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4h3Z"
							clip-rule="evenodd"
						/>
						<path
							d="M3 6a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-3.586a1 1 0 0 0-.293-.707L7.293 6.293A1 1 0 0 0 6.586 6H3Z"
						/>
					</svg>
				</button>
			</div>
			<Notification
				type="danger"
				text="Keep this key in a secure location. Losing your key results in the inability to view your tasks."
			/>
			<form method="post" action="?/deleteAccount">
				<input type="hidden" id="keyHash" name="keyHash" />
				<button class="btn font-bold">Encrypt data from now on</button>
			</form>
		</div>
	</details>
</section>

<section class="flex flex-col gap-4" id="delete">
	<h2>User deletion</h2>

	<details>
		<summary class="btn max-w-fit cursor-pointer text-red-700 dark:text-red-400 select-none"
			>Delete account</summary
		>
		<div class="flex flex-col gap-4 mt-4">
			<Notification
				type="danger"
				text="<strong>Caution!</strong> If you delete your account, all of your account information will be
				deleted. You can then create a new account, but your old information cannot be recovered."
			/>
			<form method="post" action="?/deleteAccount">
				<button class="btn font-bold text-red-700 dark:text-red-400"
					>Confirm account deletion</button
				>
			</form>
		</div>
	</details>
</section>
