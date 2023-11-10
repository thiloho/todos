<script lang="ts">
	import { enhance } from '$app/forms';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Account</h1>

<ul>
	<li>Provider: <strong>{data.authProvider}</strong></li>
	<li>User id: <strong>{data.userId}</strong></li>
	<li>Username: <strong>{data.username}</strong></li>
</ul>

<form method="post" action="?/logout" use:enhance>
	<button type="submit" class="btn">Log out</button>
</form>

<form method="post" action="?/deleteAccount">
	<button class="btn">Delete account</button>
</form>
