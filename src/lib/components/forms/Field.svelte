<script lang="ts" generics="T extends Record<string, unknown>">
	import { getFormCtx, setField } from './inputs/context.svelte';
	import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
	import type { Snippet } from 'svelte';
	import type { Lookup, LookupFieldCtx } from '$lib/interfaces/Lookup';
	import { setLookups } from './inputs/LookupStore.svelte';
	type Props = {
		form: SuperForm<T>;
		path: FormPathLeaves<T>;
		children: Snippet;
		disabled?: boolean;
		class?: string;
		lookupCtx?: LookupFieldCtx;
	};

	let { form, path, class: classes, disabled = false, lookupCtx, children }: Props = $props();

	let { disabled: formDisabled } = getFormCtx();
	let { value, focused, disabled: _disabled, errors } = setField({ form, path });
	if (lookupCtx) {
		setLookups({ value: $value, ...lookupCtx });
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
		? '[&>.input-group]:border-error-500-400-token [&>input]:border-error-500-400-token'
		: ''} [&>input]:min-h-10 {classes ?? ''}"
>
	{@render children()}
</div>
