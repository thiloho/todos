<script lang="ts">
	import { enhance } from '$app/forms';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-2xl font-bold">Account</h1>

<ul>
	<li>User id: <strong>{data.userId}</strong></li>
	<li>Username: <strong>{data.githubUsername}</strong></li>
</ul>

<form method="post" action="?/logout" use:enhance>
	<button
		type="submit"
		class="ps-2 pe-2 py-1 bg-neutral-100 border rounded border-neutral-200 text-blue-900 hover:underline hover:text-blue-950"
		>Log out</button
	>
</form>
