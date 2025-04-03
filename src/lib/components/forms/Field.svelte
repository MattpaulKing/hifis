<script lang="ts" generics="T extends Record<string, unknown>">
	import { LookupStore, setLookups } from './inputs/LookupStore.svelte';
	import { getFormCtx, setField } from './inputs/context.svelte';
	import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
	import type { Snippet } from 'svelte';

	type Props = {
		form: SuperForm<T>;
		path: FormPathLeaves<T>;
		children: Snippet;
		disabled?: boolean;
		class?: string;
		lookups?: LookupStore;
	};

	let { form, path, class: classes, disabled = false, lookups, children }: Props = $props();

	let { disabled: formDisabled } = getFormCtx();
	let { focused, disabled: _disabled, errors } = setField({ form, path });
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
