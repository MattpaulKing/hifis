<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { assertGridOptions } from './utils/assert';
	import { getGridDimensions } from './utils/grid';
	import { setGridContext } from './utils/gridContext.svelte';
	import { findGridSize } from './utils/breakpoints';
	import type { GridDimensions } from './types';
	import GridItemTabs from './GridItemTabs.svelte';
	type Props = {
		cols: number;
		rows: number;
		itemSize: { width: number; height: number };
		gap?: number;
		breakpoints?: {
			xxl: number;
			xl: number;
			lg: number;
			md: number;
			sm: number;
			xs: number;
		};
		bounds?: boolean;
		readOnly?: boolean;
		debug?: boolean;
		class?: string;
		collision?: 'none' | 'push' | 'compress';
		autoCompress?: boolean;
		children: Snippet;
	};
	let {
		cols = 0,
		rows = 0,
		itemSize,
		breakpoints = {
			xxl: 1536,
			xl: 1280,
			lg: 1024,
			md: 768,
			sm: 640,
			xs: 320
		},
		bounds,
		readOnly,
		debug,
		gap = 0,
		class: classes,
		collision = 'none',
		children
	}: Props = $props();

	let calculatedGridSize: GridDimensions | undefined = $state();

	let gridSettings = setGridContext({
		cols,
		rows,
		itemSize,
		bounds,
		readOnly,
		debug,
		collision
	});

	let valid = $derived(assertGridOptions({ cols, rows, itemSize }));

	onMount(() => {
		if (!gridSettings.boundsTo) return;
		const sizeObserver = new ResizeObserver((entries) => {
			if (entries.length > 1) {
				throw new Error('that observer must have only one entry');
			}
			calculatedGridSize = getGridDimensions(Object.values(gridSettings.items));
			gridSettings.cols = calculatedGridSize.cols;
		});
		sizeObserver.observe(gridSettings.boundsTo);
		return () => sizeObserver.disconnect();
	});
</script>

<div
	class="relative! {classes}"
	bind:this={gridSettings.boundsTo}
	style={`width: ${gridSettings.containerWidth ? `${gridSettings.containerWidth}px` : '100%'}; 
	height: ${gridSettings.containerHeight ? `${gridSettings.containerHeight}px` : '100%'};`}
>
	{#if gridSettings.itemSize}
		{@render children()}
	{/if}
</div>
