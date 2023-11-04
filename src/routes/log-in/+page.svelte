<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
</script>

<h1 class="text-2xl font-bold">Log in</h1>

<div class="flex gap-4">
	<button
		on:click={() => signIn('google')}
		class="ps-2 pe-2 py-1 bg-neutral-100 border rounded border-neutral-200 text-blue-900 hover:underline hover:text-blue-950"
		>Log in with Google</button
	>
	<button
		on:click={() => signIn('github')}
		class="ps-2 pe-2 py-1 bg-neutral-100 border rounded border-neutral-200 text-blue-900 hover:underline hover:text-blue-950"
		>Log in with GitHub</button
	>
</div>
