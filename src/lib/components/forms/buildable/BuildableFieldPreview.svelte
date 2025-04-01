<script lang="ts">
	import { getGridContext, GridItemState } from '../../user-grid';
	import { onMount, tick, type Snippet } from 'svelte';
	import type { LayoutItem } from '../../user-grid/types';

	type Props = {
		item: LayoutItem;
		dragEvent: DragEvent;
		children: Snippet;
		class?: string;
	};
	let { class: classes, item, dragEvent, children }: Props = $props();

	let gridSettings = getGridContext();
	let controller = new GridItemState({ item });

	onMount(() => {
		controller.init();
		gridSettings.registerItem(controller.item);
		controller.moveStartMouse(dragEvent);
		return () => {
			gridSettings.unregisterItem(controller.item);
		};
	});
</script>

{#if controller.active}
	<div
		class="{classes} absolute z-50 border border-red-500 opacity-50 transition-transform"
		style={`left:${controller.preview.left}px; top:${controller.preview.top}px;  
		width: ${controller.preview.width}px; height: ${controller.preview.height}px; z-index: -10;`}
	>
		{@render children()}
	</div>
{/if}
