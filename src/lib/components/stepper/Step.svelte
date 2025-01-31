<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
	import type { StepperStore } from '.';
	import type { StepPage } from './StepperStore.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		stepperStore: StepperStore;
		idx: number;
		page: StepPage;
		onclick?: MouseEventHandler<HTMLAnchorElement>;
		children: Snippet;
	};
	let { stepperStore, idx, page, onclick: _onclick, children }: Props = $props();
</script>

<a
	href={page.href}
	onclick={(e) => {
		stepperStore.activeIdx = idx;
		_onclick?.(e);
	}}
	class="{idx === stepperStore.activeIdx
		? 'variant-filled text-white dark:variant-filled dark:text-black'
		: page.disabled
			? 'bg-surface-200-700-token text-surface-500-400-token pointer-events-none'
			: 'bg-surface-300-600-token'} btn btn-sm relative z-50 rounded-full capitalize transition-colors"
>
	{@render children()}
</a>
