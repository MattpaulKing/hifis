<script lang="ts">
	import { getField } from './context.svelte';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	let {
		type,
		class: classes,
		...restProps
	}: { type: HTMLInputTypeAttribute; class?: string } & HTMLInputAttributes = $props();
	let { value, path, disabled, errors } = getField<string>();
</script>

<input
	{type}
	autocomplete="off"
	class="input {classes}"
	readonly={$disabled}
	name={path}
	title={$value}
	bind:value={$value}
	aria-invalid={$errors ? 'true' : 'false'}
	{...restProps}
/>
