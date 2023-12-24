<script lang="ts">
	import { enhance } from '$app/forms';
	import Notification from '$lib/components/Notification.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Account</h1>

<section class="flex flex-col gap-8" id="overview">
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

<section class="flex flex-col gap-8" id="delete">
	<h2>User deletion</h2>

	<details>
		<summary class="btn max-w-fit cursor-pointer text-red-900 dark:text-red-400"
			>Delete account</summary
		>
		<div class="flex flex-col gap-4 mt-4">
			<Notification
				type="danger"
				text="<strong>Caution!</strong> If you delete your account, all of your account information will be
				deleted. You can then create a new account, but your old information cannot be recovered."
			/>
			<form method="post" action="?/deleteAccount">
				<button class="btn font-bold text-red-900 dark:text-red-400"
					>Confirm account deletion</button
				>
			</form>
		</div>
	</details>
</section>
