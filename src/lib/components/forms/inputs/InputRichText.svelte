<script lang="ts">
	import { getField } from './context.svelte';
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	let { class: classes, ...restProps }: { class?: string } & HTMLTextareaAttributes = $props();
	let { value, path, disabled, errors } = getField<string>();
</script>

<textarea
	name={path}
	class="input {classes}"
	aria-invalid={$errors ? 'true' : 'false'}
	readonly={$disabled}
	bind:value={$value}
	{...restProps}
>
</textarea>
