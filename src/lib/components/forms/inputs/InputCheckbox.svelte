<script lang="ts">
	import { getField } from './context.svelte';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	let {
		type = 'text',
		class: classes,
		...restProps
	}: { type?: HTMLInputTypeAttribute; class?: string } & HTMLInputAttributes = $props();
	let { value, path, disabled, errors } = getField<boolean>();
</script>

<input
	type="checkbox"
	class="input {classes}"
	readonly={$disabled}
	name={path}
	bind:checked={$value as boolean}
	aria-invalid={$errors ? 'true' : 'false'}
	{...restProps}
/>
