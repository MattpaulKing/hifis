<script lang="ts">
	import { GridSettings } from '.';
	import { setFormCtx } from '../forms/inputs/context.svelte';
	import { onDestroy, onMount, type Snippet } from 'svelte';

	type Props = {
		gridSettings: GridSettings;
		class?: string;
		autoCompress?: boolean;
		userBuilding?: boolean;
		onGridResize: (rect: DOMRectReadOnly) => void;
		ondragover?: (e: DragEvent) => void;
		children: Snippet;
		fieldPreview?: Snippet<[{ dragEvent: DragEvent }]>;
	};
	let {
		gridSettings,
		class: classes,
		onGridResize,
		ondragover: _ondragover,
		userBuilding = false,
		children,
		fieldPreview
	}: Props = $props();

	function ondragover(e: DragEvent) {
		dragEvent = e;
		_ondragover?.(e);
	}
	let dragEvent = $state<DragEvent | null>(null);
	let rerender = $state();
	setFormCtx({ disabled: userBuilding });

	let resizeObserver: ResizeObserver | undefined;
	onMount(() => {
		if (!gridSettings.boundsTo) return;
		resizeObserver = new ResizeObserver((entries) => {
			if (entries.length < 0) return;
			let rect = entries[0].contentRect;
			gridSettings.maxDimensions = {
				cols: Math.round(rect.width / (gridSettings.itemSize.width + gridSettings.gap)),
				rows: Math.round(rect.height / (gridSettings.itemSize.height + gridSettings.gap))
			};
			onGridResize(rect);
		});
		resizeObserver.observe(gridSettings.boundsTo);
	});
	onDestroy(() => {
		if (resizeObserver) resizeObserver.disconnect();
	});
</script>

{#key rerender}
	<div
		{ondragover}
		onpointerleave={() => (dragEvent = null)}
		role="grid"
		tabindex="0"
		class="relative bg-gray-800 {classes} {gridSettings.screenView === 'xl'
			? 'max-w-full'
			: gridSettings.screenView === 'lg'
				? 'max-w-5xl'
				: gridSettings.screenView === 'sm'
					? 'max-w-md'
					: ''}"
		bind:this={gridSettings.boundsTo}
	>
		{#if gridSettings.itemSize && gridSettings.boundsTo}
			{@render children()}
			{#if dragEvent !== null}
				{@render fieldPreview?.({ dragEvent })}
			{/if}
		{/if}
	</div>
{/key}
