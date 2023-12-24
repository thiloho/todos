<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';

	import type { PageData } from './$types';

	export let data: PageData;

	let darkMode = true;

	function toggleDarkMode() {
		darkMode = !darkMode;

		localStorage.setItem('theme', darkMode ? 'dark' : 'light');

		darkMode
			? document.documentElement.classList.add('dark')
			: document.documentElement.classList.remove('dark');
	}

	if (browser) {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
			darkMode = true;
		} else {
			document.documentElement.classList.remove('dark');
			darkMode = false;
		}
	}
</script>

<header class="bg-blue-900 text-white p-4">
	<div class="max-w-screen-2xl ms-auto me-auto flex items-center gap-4">
		<p>
			<strong>
				<a href="/">Todos</a>
			</strong>
		</p>
		<button
			title={darkMode ? 'Enable light theme' : 'Enable dark theme'}
			on:click={toggleDarkMode}
			class="btn btn-icon bg-blue-950 border border-white dark:border-white dark:bg-blue-950"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5 hidden dark:block"
			>
				<path
					d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z"
				/>
			</svg>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5 dark:hidden"
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
	<div class="max-w-screen-2xl ms-auto me-auto flex gap-4 flex-wrap">
		<p>
			<small>Copyright © 2023 Thilo Hohlt.</small>
		</p>
		<div class="ms-auto text-center flex gap-4">
			<p>
				<small>
					<a href="https://github.com/thiloho/todos" class="underline hover:no-underline"
						>Source code</a
					>
				</small>
			</p>
			<p>
				<small>
					<a href="/privacy" class="underline hover:no-underline">Privacy</a>
				</small>
			</p>
		</div>
	</div>
</footer>
