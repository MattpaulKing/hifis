<script lang="ts">
	import { getField } from './context.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	let { class: classes, ...restProps }: { class?: string } & HTMLInputAttributes = $props();
	let { value, path, disabled, errors } = getField<string>();
</script>

<input
	type="number"
	autocomplete="off"
	class="input {classes}"
	readonly={$disabled}
	name={path}
	title={Array.isArray($value) ? $value.join(', ') : $value}
	bind:value={$value}
	aria-invalid={$errors ? 'true' : 'false'}
	{...restProps}
/>
