<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { GridItemState, GridItemTabs, GridItemTabsState, type TabEntity } from '.';
	import { getGridContext } from './utils/GridContext.svelte';
	import type { LayoutItem } from './types';

	type Props = {
		item: LayoutItem;
		entities: TabEntity[];
		gridItem: Snippet<[TabEntity]>;
		class?: string;
	};
	let { class: classes, item, entities, gridItem }: Props = $props();

	let gridSettings = getGridContext();
	let controller = new GridItemState({ item });

	onMount(() => {
		controller.init();
		gridSettings.registerItem(controller.item);
		return () => {
			gridSettings.unregisterItem(controller.item);
		};
	});
	let tabState = new GridItemTabsState({
		entities,
		entityLabel: ''
	});
</script>

{#snippet gridItemContent()}
	<div
		class="flex w-full place-items-center justify-between {controller.active
			? '[&_span]:select-none'
			: ''}"
	>
		<GridItemTabs {tabState}>
			<div class="flex place-items-center">
				<button
					onpointerdown={(e) => {
						e.stopPropagation();
						controller.item.moveable = !controller.item.moveable;
					}}
					class="touch-none px-1 {item.moveable ? 'opacity-100' : 'opacity-50'}"
				>
					<img src="/Move.png" class="h-7 w-7 dark:invert" alt="move" />
				</button>
				<div
					onpointerdown={(e) => {
						controller.item.resizeable ? controller.resizeMouseStart(e) : null;
					}}
					class="btn btn-sm touch-none px-1 hover:variant-ghost"
				>
					<img src="/Resize.png" class="h-7 w-7 dark:invert" alt="resize" />
				</div>
			</div>
		</GridItemTabs>
	</div>
	{#if controller.activeEntity}
		{@render gridItem(controller.activeEntity)}
	{/if}
{/snippet}

<div
	class="absolute transition-transform {classes} {controller.active
		? 'opacity-80 '
		: ''} {item.moveable ? 'border' : ''}"
	style={`left:${controller.left}px; top:${controller.top}px; width: ${controller.width}px; height: ${controller.height}px;`}
	bind:this={controller.moveableEl}
	onpointerdown={(e) => (controller.item.moveable ? controller.moveStartMouse(e) : null)}
	ontouchstart={(e) => (controller.item.moveable ? controller.moveStartTouch(e) : null)}
>
	{@render gridItemContent()}
</div>

{#if controller.active}
	<div
		class="{classes} border border-red-500 opacity-50 transition-transform"
		style={`position: absolute; left:${controller.preview.left}px; top:${controller.preview.top}px;  
		width: ${controller.preview.width}px; height: ${controller.preview.height}px; z-index: -10;`}
	>
		{@render gridItemContent()}
	</div>
{/if}
