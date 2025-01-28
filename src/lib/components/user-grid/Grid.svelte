<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { assertGridOptions } from './utils/assert';
	import { getGridDimensions } from './utils/grid';
	import { findGridSize } from './utils/breakpoints';
	import { setGridContext } from '.';
	import type { GridDimensions } from './types';
	type Props = {
		cols:
			| number
			| {
					xxl: number;
					xl: number;
					lg: number;
					md: number;
					sm: number;
					xs: number;
			  };
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
		children
	}: Props = $props();

	let gridSettings = setGridContext({
		cols,
		rows,
		itemSize,
		bounds,
		gap,
		readOnly,
		debug
	});

	let shouldExpandCols = $state(cols === 0);
	let shouldExpandRows = $state(rows === 0);

	let calculatedGridSize: GridDimensions | undefined = $state(
		getGridDimensions(Object.values(gridSettings.items))
	);
	let _cols = $state(cols === 0 ? calculatedGridSize.cols : cols);
	let _rows = $state(rows === 0 ? calculatedGridSize.rows : rows);

	let valid = $derived(assertGridOptions({ cols, rows, itemSize }));
	$inspect(valid);

	onMount(() => {
		if (!gridSettings.boundsTo) return;
		const sizeObserver = new ResizeObserver((entries) => {
			if (entries.length > 1) {
				throw new Error('that observer must have only one entry');
			}
			let entry = entries[0];
			const width = entry.contentRect.width;
			const height = entry.contentRect.height;
			_cols = findGridSize(cols, width, breakpoints);
			_rows = findGridSize(rows, height, breakpoints);
			shouldExpandCols = _cols === 0;
			shouldExpandRows = _rows === 0;
			gridSettings.itemSize = {
				width: itemSize.width ?? (width - (_cols + 1) * gap) / _cols,
				height: itemSize.height ?? (height - (_rows + 1) * gap) / _rows
			};
		});
		sizeObserver.observe(gridSettings.boundsTo);
		return () => sizeObserver.disconnect();
	});
</script>

<div
	class="relative {classes}"
	bind:this={gridSettings.boundsTo}
	style={`width: ${gridSettings.containerWidth ? `${gridSettings.containerWidth}px` : '100%'}; 
	height: ${gridSettings.containerHeight ? `${gridSettings.containerHeight}px` : '100%'};`}
>
	{#if gridSettings.itemSize}
		{@render children()}
	{/if}
</div>
