<script lang="ts">
	export let value: string;
	export let organizeMethod: string;
	export let options: string[];

	const formatDisplayedString = (string: string) => {
		string = string.charAt(0).toUpperCase() + string.slice(1);
		string = string.replace('-', ' ');
		return string;
	};
</script>

<div class="flex flex-col gap-1 items-start">
	<label for="task-list-{organizeMethod}">{formatDisplayedString(organizeMethod)}</label>
	<select
		name="task-list-{organizeMethod}"
		id="task-list-{organizeMethod}"
		class="input-common"
		{value}
	>
		{#each options as option}
			<option selected={value === option} value={option}>{formatDisplayedString(option)}</option>
		{/each}
	</select>
</div>
