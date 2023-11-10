<script lang="ts">
	import Notification from '$lib/components/Notification.svelte';
</script>

<h1>Log in</h1>

<Notification type="info" text="Please log in to continue." />

<div class="flex gap-4">
	<a href="/login/github" class="btn">Log in with GitHub</a>
	<a href="/login/google" class="btn">Log in with Google</a>
</div>
