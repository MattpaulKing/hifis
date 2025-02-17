<script lang="ts" generics="T extends Record<string, unknown>">
	import { getFormCtx, setArrayField } from './inputs/context.svelte';
	import { LookupStore, setLookups } from './inputs/LookupStore.svelte';
	import type { FormPathArrays, SuperForm } from 'sveltekit-superforms';
	import type { Snippet } from 'svelte';
	type Props = {
		form: SuperForm<T>;
		path: FormPathArrays<T>;
		children: Snippet;
		disabled?: boolean;
		class?: string;
		lookups?: LookupStore;
	};

	let { form, path, class: classes, disabled = false, lookups, children }: Props = $props();

	let { disabled: formDisabled } = getFormCtx();
	let { value, focused, disabled: _disabled, errors } = setArrayField({ form, path });
	if (lookups) {
		setLookups(lookups);
	}
	$_disabled = disabled || $_disabled || $formDisabled;

	function handleLostFocus(e: FocusEvent) {
		if (!fieldContainer?.contains(e.relatedTarget as Node | null)) {
			$focused = false;
		}
	}
	let fieldContainer: HTMLDivElement;
</script>

<div
	onfocusout={handleLostFocus}
	bind:this={fieldContainer}
	class="mt-4 flex w-full flex-col justify-end {$errors
		? '[&>.input-group]:border-error-500-400-token [&>.input]:border-error-500-400-token'
		: ''} [&>input]:min-h-10 {classes ?? ''}"
>
	{@render children()}
</div>
