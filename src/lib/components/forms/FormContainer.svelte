<script lang="ts" generics="T extends Record<string, unknown>">
	import { setFormCtx } from './inputs/context.svelte';
	import { getFormMsgStore, LoadingSpinner } from '.';
	import { fade } from 'svelte/transition';
	import { onDestroy, type Snippet } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms';

	let {
		form,
		action,
		disabled = false,
		enctype = 'application/x-www-form-urlencoded',
		children,
		class: classes,
		title,
		btns,
		showMsg = true,
		hasFormEl = true
	}: {
		form: SuperForm<T>;
		action: string;
		disabled?: boolean;
		enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data';
		children: any;
		class?: string;
		title?: Snippet;
		btns?: Snippet;
		showMsg?: boolean;
		hasFormEl?: boolean;
	} = $props();

	setFormCtx({ disabled });
	let { delayed, enhance, formId } = form;
	let msgStore = getFormMsgStore();
	onDestroy(() => {
		msgStore.remove($formId);
	});
</script>

<div in:fade class="relative flex flex-col {classes ?? 'p-6'}">
	<div class="absolute right-0 top-0 z-50 flex w-full flex-col items-end">
		{#if showMsg && msgStore.current && msgStore.current.id === $formId}
			<div
				transition:fade
				class="badge m-4 flex h-fit w-fit p-2
        {msgStore.current.status === 'error'
					? 'variant-soft-error'
					: msgStore.current.status === 'success'
						? 'variant-filled-success'
						: ''}"
			>
				<span class="text-base font-medium">
					{msgStore.current.msg}
				</span>
			</div>
		{/if}
	</div>
	{#if $delayed}
		<LoadingSpinner />
	{/if}
	<div class="flex w-full justify-between">
		<h3 class="h3 font-bold">{@render title?.()}</h3>
		{@render btns?.()}
	</div>
	{#if hasFormEl}
		<form
			class="flex w-full flex-col lg:grid lg:grid-cols-2 lg:gap-x-4"
			method="POST"
			{action}
			use:enhance
			{enctype}
		>
			{@render children()}
		</form>
	{:else}
		{@render children()}
	{/if}
</div>
