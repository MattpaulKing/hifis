<script lang="ts" generics="T extends Record<string, unknown>">
	import { getField } from './context.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		attrs
	}: {
		defaultValue?: string;
		attrs?: HTMLInputAttributes;
	} = $props();

	let { disabled, path, value, errors } = getField<string>();
</script>

<input
	type="date"
	autocomplete="off"
	class="input [&::-webkit-calendar-picker-indicator]:scale-150 [&::-webkit-calendar-picker-indicator]:bg-[url('/Calendar.png')] [&::-webkit-calendar-picker-indicator]:dark:invert"
	name={path}
	readonly={$disabled}
	bind:value={$value}
	aria-invalid={$errors ? 'true' : 'false'}
	{...attrs}
/>
