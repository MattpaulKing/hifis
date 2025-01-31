<script lang="ts">
	import { setGridContext } from '.';
	import type { Snippet } from 'svelte';
	type Props = {
		cols: number;
		rows: number;
		itemSize: { width: number; height: number };
		gap?: number;
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
	$inspect(gridSettings.maxDimensions.rows);
</script>

<div class="relative h-full w-full {classes}" bind:this={gridSettings.boundsTo}>
	{#if gridSettings.itemSize && gridSettings.boundsTo}
		{@render children()}
	{/if}
</div>
