<script lang="ts">
	import { getField } from './context.svelte';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	let {
		type,
		...restProps
	}: { type: HTMLInputTypeAttribute; restProps?: Record<keyof HTMLInputElement, string> } =
		$props();
	let { value, path, disabled, errors } = getField<string>();
</script>

<input
	{type}
	autocomplete="off"
	class="input"
	disabled={$disabled}
	name={path}
	title={$value}
	bind:value={$value}
	aria-invalid={$errors ? 'true' : 'false'}
	{...restProps}
/>
