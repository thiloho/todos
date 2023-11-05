<script lang="ts">
	import '../app.css';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<header class="bg-blue-900 text-white p-4">
	<div class="max-w-screen-2xl ms-auto me-auto flex items-center gap-4">
		<p>
			<strong>
				<a href="/">Todos</a>
			</strong>
		</p>
		<button class="btn btn-icon bg-blue-950 border border-white">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					fill-rule="evenodd"
					d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
		{#if data.session}
			<a href="/account" class="ms-auto hover:underline">Account</a>
		{:else}
			<a href="/login" class="ms-auto hover:underline">Log in</a>
		{/if}
	</div>
</header>
<main class="mt-12 mb-16 ps-4 pe-4">
	<div class="max-w-screen-2xl ms-auto me-auto flex flex-col gap-8">
		<slot />
	</div>
</main>
<footer class="p-4 border-t border-neutral-200 dark:border-neutral-700">
	<div class="max-w-screen-2xl ms-auto me-auto flex flex-col gap-4">
		<p>
			<small>Copyright © 2023 Thilo Hohlt.</small>
		</p>
	</div>
</footer>
