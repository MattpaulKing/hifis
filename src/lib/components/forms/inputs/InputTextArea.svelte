<script lang="ts">
	import { getField } from './context.svelte';
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	let { class: classes, ...restProps }: { class?: string } & HTMLTextareaAttributes = $props();
	let { value, path, disabled, errors } = getField<string>();
</script>

<textarea
	autocomplete="off"
	class="textarea {classes}"
	readonly={$disabled}
	name={path}
	title={$value}
	bind:value={$value}
	aria-invalid={$errors ? 'true' : 'false'}
	{...restProps}
></textarea>
