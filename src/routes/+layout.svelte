<script>
	import '../app.css';
</script>

<header class="bg-blue-900 text-white p-4">
	<div class="max-w-screen-2xl ms-auto me-auto flex items-center gap-4">
		<p>
			<strong>Todos</strong>
		</p>
		<button class="p-2 rounded border border-white bg-blue-950 hover:scale-105">
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
        <a href="/log-in" class="ms-auto hover:underline">Log in</a>
	</div>
</header>
<main class="mt-12 mb-16 ps-4 pe-4">
	<div class="max-w-screen-2xl ms-auto me-auto flex flex-col gap-8">
		<slot />
	</div>
</main>
<footer class="p-4 border-t">
	<div class="max-w-screen-2xl ms-auto me-auto flex flex-col gap-4">
		<p>
			<small>Copyright © 2023 Thilo Hohlt.</small>
		</p>
	</div>
</footer>
