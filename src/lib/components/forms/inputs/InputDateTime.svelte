<script lang="ts" generics="T extends Record<string, unknown>">
	import { getField } from './context.svelte';
	import { dateProxy, type FormPath, type SuperForm } from 'sveltekit-superforms';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		form,
		attrs
	}: {
		form: SuperForm<T>;
		defaultValue?: string;
		attrs?: HTMLInputAttributes;
	} = $props();

	let { disabled, path, errors } = getField<Date>();
	let strValue = dateProxy(form, path as FormPath<T, Date>, { format: 'datetime' });
</script>

<input
	type="datetime-local"
	autocomplete="off"
	class="input [&::-webkit-calendar-picker-indicator]:scale-150 [&::-webkit-calendar-picker-indicator]:bg-[url('/Calendar.png')] [&::-webkit-calendar-picker-indicator]:dark:invert"
	name={path}
	readonly={$disabled}
	bind:value={$strValue}
	aria-invalid={$errors ? 'true' : 'false'}
	{...attrs}
/>
