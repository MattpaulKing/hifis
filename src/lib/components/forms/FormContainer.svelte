<script lang="ts" generics="T extends Record<string, unknown>">
	import { setFormCtx } from './inputs/context.svelte';
	import { getFormMsgStore, LoadingSpinner } from '.';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	let {
		form,
		action,
		disabled = false,
		enctype = 'application/x-www-form-urlencoded',
		bordered = true,
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
		bordered?: boolean;
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

<div
	in:fade
	class="relative flex h-min w-fit flex-wrap md:flex-nowrap {bordered
		? 'card border-surface-200-700-token border shadow-lg shadow-surface-500'
		: ''}"
>
	<div class="absolute right-0 top-0 z-50 flex w-full flex-col items-end">
		{#if msgStore.current?.msg}
			<div
				transition:fade
				class="flex h-fit w-fit max-w-64 border p-2 rounded-token {msgStore.current.status ===
				'error'
					? 'variant-soft-error border-error-400-500-token'
					: ''}"
			>
				<span>
					{msgStore.current.msg}
				</span>
			</div>
		{/if}
	</div>
	{@render stepper?.()}
	<div class="flex flex-col p-6 {classes ?? ''}">
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
</div>
