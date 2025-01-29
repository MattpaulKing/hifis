<!--@component?
  min: minimum size of item in Grid Units
  max: maximum size of item in Grid Units
-->

<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { GridItemState, GridItemTabs } from '.';
	import { getGridContext } from './utils/GridContext.svelte';
	import type { LayoutItem, LayoutItemEntity } from './types';

	type Props = {
		item: LayoutItem;
		entities: LayoutItemEntity[];
		onChange?: (item: LayoutItem) => void;
		gridItem: Snippet<[LayoutItemEntity]>;
		class?: string;
	};
	let { class: classes, item = $bindable(), entities = $bindable(), gridItem }: Props = $props();

	let gridSettings = getGridContext();
	let controller = new GridItemState({ item, entities });

	//TODO: EVERYTHING IN GRIDITEMSTATE HAS TO GO THROUGH ITEM

	onMount(() => {
		controller.init();
		gridSettings.registerItem(controller.item);
		return () => {
			gridSettings.unregisterItem(controller.item);
		};
	});
</script>

{#snippet gridItemContent()}
	<div class="flex w-full place-items-center justify-between">
		<GridItemTabs {entities}>
			<div class="flex place-items-center">
				<button
					onpointerdown={(e) => {
						e.stopPropagation();
						controller.item.moveable = !item.moveable;
					}}
					class="touch-none select-none px-1 {item.moveable ? 'opacity-100' : 'opacity-50'}"
				>
					<img src="/Move.png" class="h-7 w-7 dark:invert" alt="move" />
				</button>
				<button class="btn btn-sm touch-none select-none px-1 hover:variant-ghost">
					<img src="/Resize.png" class="h-7 w-7 dark:invert" alt="resize" />
				</button>
			</div>
		</GridItemTabs>
	</div>
	{#if controller.activeEntity}
		{@render gridItem(controller.activeEntity)}
	{/if}
{/snippet}

<!-- <svelte:window  /> -->

<div
	class="absolute transition-transform {classes} {controller.active
		? 'opacity-80'
		: ''} {item.moveable ? 'border' : ''}"
	style={`left:${controller.left}px; top:${controller.top}px; width: ${controller.width}px; height: ${controller.height}px;`}
	bind:this={controller.moveableItemRef}
	onpointerdown={(e) => (controller.item.moveable ? controller.moveStartMouse(e) : null)}
	ontouchstart={(e) => (controller.item.moveable ? controller.moveStartTouch(e) : null)}
>
	{@render gridItemContent()}
</div>

{#if controller.active}
	<div
		class="{classes} border opacity-50 transition-transform"
		style={`position: absolute; left:${controller.preview.left}px; top:${controller.preview.top}px;  
		width: ${controller.preview.width}px; height: ${controller.preview.height}px; z-index: -10;`}
	>
		{@render gridItemContent()}
	</div>
{/if}

<style>
	.resizer-default {
		touch-action: none;
		position: absolute;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		width: 20px;
		height: 20px;
		right: 0;
		bottom: 0;
		cursor: se-resize;
	}
	.resizer-default::after {
		content: '';
		position: absolute;
		right: 3px;
		bottom: 3px;
		width: 5px;
		height: 5px;
		border-right: 2px solid rgba(0, 0, 0, 0.4);
		border-bottom: 2px solid rgba(0, 0, 0, 0.4);
	}
</style>
