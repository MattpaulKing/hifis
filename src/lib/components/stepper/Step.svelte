<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
	import type { StepperStore } from '.';

	type Props = {
		stepperStore: StepperStore;
		idx: number;
		href: string;
		page: string;
		onclick?: MouseEventHandler<HTMLAnchorElement>;
	};
	let { stepperStore, idx, href, page, onclick }: Props = $props();
</script>

<a
	{href}
	{onclick}
	class="{idx === stepperStore.pageIdx
		? 'variant-filled text-white dark:variant-filled dark:text-black'
		: stepperStore.pageIdxMax < idx
			? 'bg-surface-200-700-token text-surface-500-400-token pointer-events-none'
			: 'bg-surface-300-600-token'} btn btn-sm relative z-50 rounded-full capitalize transition-all {stepperStore.expanded
		? 'hidden'
		: 'block'}"
>
	{idx + 1}
</a>
<a
	{href}
	{onclick}
	class="{idx === stepperStore.pageIdx
		? 'variant-filled text-white dark:variant-filled dark:text-black'
		: stepperStore.pageIdxMax < idx
			? 'bg-surface-200-700-token text-surface-500-400-token pointer-events-none'
			: 'bg-surface-300-600-token'} btn btn-sm relative z-50 rounded-full capitalize transition-all {stepperStore.expanded
		? 'block'
		: 'hidden'}"
>
	{page}
</a>
