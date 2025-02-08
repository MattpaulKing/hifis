<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import type { MouseEventHandler } from 'svelte/elements';
	import type { StepperStore } from '.';
	import type { StepPage } from './StepperStore.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		stepperStore: StepperStore;
		idx: number;
		page: StepPage;
		disabled?: boolean;
		onclick?: MouseEventHandler<HTMLAnchorElement>;
		children: Snippet;
	};
	let { stepperStore, idx, page: step, onclick: _onclick, children }: Props = $props();
</script>

<a
	href={step.getHref()}
	onclick={(e) => {
		e.preventDefault();
		stepperStore.activeIdx = idx;
		replaceState(step.getHref(), page.state);
		_onclick?.(e);
	}}
	class="btn btn-sm relative z-50 max-w-28 whitespace-break-spaces capitalize transition-colors rounded-token {idx ===
	stepperStore.activeIdx
		? 'variant-filled text-white dark:variant-filled dark:text-black'
		: step.disabled()
			? 'bg-surface-200-700-token text-surface-500-400-token pointer-events-none'
			: 'bg-surface-300-600-token'} "
>
	{@render children()}
</a>
