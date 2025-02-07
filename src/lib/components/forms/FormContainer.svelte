<script lang="ts" generics="T extends Record<string, unknown>">
	import { setFormCtx } from './inputs/context.svelte';
	import { getFormMsgStore, LoadingSpinner } from '.';
	import { fade } from 'svelte/transition';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { Snippet } from 'svelte';

	let {
		form,
		action,
		disabled = false,
		enctype = 'application/x-www-form-urlencoded',
		children,
		class: classes,
		title,
		btns,
		stepper
	}: {
		form: SuperForm<T>;
		action: string;
		disabled?: boolean;
		enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data';
		children: any;
		class?: string;
		title?: Snippet;
		btns?: Snippet;
		stepper?: Snippet;
	} = $props();

	setFormCtx({ disabled });
	let { delayed, enhance } = form;
	let msgStore = getFormMsgStore();
</script>

<div class="relative flex flex-col p-6 {classes ?? ''}">
	<div class="absolute right-0 top-0 z-50 flex w-full flex-col items-end">
		{#if msgStore.current?.msg}
			<div
				transition:fade
				class="flex h-fit w-fit max-w-64 border p-2 rounded-token {msgStore.current.status ===
				'error'
					? 'variant-soft-error border-error-400-500-token'
					: msgStore.current.status === 'success'
						? 'variant-filled-success border-success-400-500-token font-bold'
						: ''}"
			>
				<span>
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
	<form
		class="flex w-full flex-col lg:grid lg:grid-cols-2 lg:gap-x-4"
		method="POST"
		{action}
		use:enhance
		{enctype}
	>
		{@render children()}
	</form>
</div>
