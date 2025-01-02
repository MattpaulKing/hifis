<script lang="ts" generics="T extends Record<string, unknown>">
	import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
	import { getFormCtx, setField } from './inputs/context.svelte';
	type Props = {
		form: SuperForm<T>;
		path: FormPathLeaves<T>;
		disabled?: boolean;
		children: any;
		[k: string]: unknown;
	};
	let { form, path, disabled = false, children, ...restProps }: Props = $props();

	let { disabled: formDisabled } = getFormCtx();
	let { focused, disabled: _disabled, errors } = setField({ form, path });
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
		? '[&>input]:border-error-500-400-token'
		: ''} [&>input]:min-h-10 {restProps.class ?? ''}"
>
	{@render children()}
</div>
