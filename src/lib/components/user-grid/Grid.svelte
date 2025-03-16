<script lang="ts">
	import { GridSettings, setGridContext } from '.';
	import { BuildableFieldPreview, type buildableFormFields } from '../forms';
	import { position2coordinate } from './utils/item';
	import type { Snippet } from 'svelte';
	import type { LayoutItem } from './types';

	type Props = {
		gridSettings: GridSettings;
		class?: string;
		autoCompress?: boolean;
		draggedField?: (typeof buildableFormFields)[keyof typeof buildableFormFields];
		previewDraggedFieldItem?: LayoutItem;
		children: Snippet;
	};
	let {
		gridSettings,
		class: classes,
		draggedField = $bindable(),
		previewDraggedFieldItem = $bindable(),
		children
	}: Props = $props();

	function ondragover(e: DragEvent) {
		if (!draggedField) return;
		let {
			id,
			layout: { widthGridUnits, heightGridUnits }
		} = draggedField;
		previewDraggedFieldItem = {
			id,
			x:
				position2coordinate(e.pageX, gridSettings.itemSize.width, gridSettings.gap) -
				widthGridUnits,
			y:
				position2coordinate(e.pageY, gridSettings.itemSize.height, gridSettings.gap) -
				heightGridUnits,

			widthGridUnits,
			heightGridUnits,
			min: {
				widthGridUnits,
				heightGridUnits
			},
			moveable: true,
			resizeable: true
		};
		dragE = e;
	}
	let dragE = $state<DragEvent>();
</script>

<div
	{ondragover}
	role="grid"
	tabindex="0"
	class="relative h-full w-full {classes}"
	bind:this={gridSettings.boundsTo}
>
	{#if gridSettings.itemSize && gridSettings.boundsTo}
		{@render children()}
	{/if}
	{#if draggedField && previewDraggedFieldItem && dragE}
		<BuildableFieldPreview item={previewDraggedFieldItem} dragEvent={dragE}>
			<span class="border border-red-500">hi</span>
		</BuildableFieldPreview>
	{/if}
</div>
