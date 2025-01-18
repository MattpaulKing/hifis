<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { assertGridOptions } from './utils/assert';
	import { getGridDimensions } from './utils/grid';
	import type { GridDimensions } from './types';
	import { setGridContext } from './utils/gridContext.svelte';
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

	let shouldExpandCols = $state(false);
	let shouldExpandRows = $state(false);
	let calculatedGridSize: GridDimensions | undefined = $state();
	let gridContainer: HTMLDivElement | undefined = $state();

	const gridSettings = setGridContext({
		cols: 0,
		rows: 0,
		items: {},
		itemSize,
		bounds,
		readOnly,
		debug
	});

	let valid = $derived(assertGridOptions({ cols, rows, itemSize }));
	onMount(() => {
		if (gridSettings.itemSize && cols === 0) {
			gridSettings.containerWidth = cols * (gridSettings.itemSize.width + gap + 1);
		} else {
			gridSettings.containerWidth = null;
		}

		if (gridSettings.itemSize && rows === 0) {
			gridSettings.containerHeight = rows * (gridSettings.itemSize.height + gap + 1);
		} else {
			gridSettings.containerHeight = null;
		}

		if (!gridContainer) return;
		gridSettings.boundsTo = gridContainer;
		const sizeObserver = new ResizeObserver((entries) => {
			if (entries.length > 1) {
				throw new Error('that observer must have only one entry');
			}
			const entry = entries[0];
			const width = entry.contentRect.width;
			const height = entry.contentRect.height;
			gridSettings.itemSize = {
				width: itemSize.width ?? (width - (cols + 1) * gap) / cols,
				height: itemSize.height ?? (height - (rows + 1) * gap) / rows
			};
		});
		sizeObserver.observe(gridContainer);
		return () => sizeObserver.disconnect();
	});
	$effect(() => {
		calculatedGridSize = getGridDimensions(Object.values(gridSettings.items));
		if (shouldExpandCols) {
			gridSettings.cols = calculatedGridSize.cols;
			gridSettings.maxCols = calculatedGridSize.cols;
		}
		if (shouldExpandRows && gridSettings.collision === 'none') {
			gridSettings.rows = calculatedGridSize.rows;
			gridSettings.maxRows = calculatedGridSize.rows;
		}
	});
</script>

<div
	class="relative! {classes}"
	bind:this={gridContainer}
	style={`width: ${gridSettings.containerWidth ? `${gridSettings.containerWidth}px` : '100%'}; 
	height: ${gridSettings.containerHeight ? `${gridSettings.containerHeight}px` : '100%'};`}
>
	{#if gridSettings.itemSize}
		{@render children()}
	{/if}
</div>
