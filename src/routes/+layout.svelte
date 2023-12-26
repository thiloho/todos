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

<header class="p-4 sticky z-30 top-0 bg-white dark:bg-neutral-900">
	<div class="max-w-screen-2xl ms-auto me-auto flex items-center gap-4">
		<a href="/" class="flex items-center gap-2">
			<img src="logo_512.svg" alt="" width="32" height="32" />
			<p>
				<strong>Todos</strong>
			</p>
		</a>
		<button
			title={darkMode ? 'Enable light theme' : 'Enable dark theme'}
			on:click={toggleDarkMode}
			class="btn btn-icon"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				class="w-4 h-4 hidden dark:block"
			>
				<path
					d="M8 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 1ZM10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM12.95 4.11a.75.75 0 1 0-1.06-1.06l-1.062 1.06a.75.75 0 0 0 1.061 1.062l1.06-1.061ZM15 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 15 8ZM11.89 12.95a.75.75 0 0 0 1.06-1.06l-1.06-1.062a.75.75 0 0 0-1.062 1.061l1.061 1.06ZM8 12a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 12ZM5.172 11.89a.75.75 0 0 0-1.061-1.062L3.05 11.89a.75.75 0 1 0 1.06 1.06l1.06-1.06ZM4 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 4 8ZM4.11 5.172A.75.75 0 0 0 5.173 4.11L4.11 3.05a.75.75 0 1 0-1.06 1.06l1.06 1.06Z"
				/>
			</svg>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				class="w-4 h-4 dark:hidden"
			>
				<path
					d="M14.438 10.148c.19-.425-.321-.787-.748-.601A5.5 5.5 0 0 1 6.453 2.31c.186-.427-.176-.938-.6-.748a6.501 6.501 0 1 0 8.585 8.586Z"
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
