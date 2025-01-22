<!--@component?
  min: minimum size of item in Grid Units
  max: maximum size of item in Grid Units
-->

<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { coordinate2size, calcPosition, snapOnMove, snapOnResize } from './utils/item';
	import { hasCollisions, getCollisions, getAvailablePosition } from './utils/grid';
	import { getGridContext } from './utils/gridContext.svelte';
	import { GridItemTabs } from '.';
	import type { ItemSize, LayoutItem, LayoutItemEntity } from './types';
	import { on } from 'svelte/events';

	type Props = {
		item: LayoutItem;
		entities: LayoutItemEntity[];
		onChange?: (item: LayoutItem) => void;
		gridItem: Snippet<[LayoutItemEntity]>;
		class?: string;
	};
	let { class: classes, item = $bindable(), entities = $bindable(), gridItem }: Props = $props();

	let gridSettings = getGridContext();
	let active = $state(false);
	let left = $state(0);
	let top = $state(0);
	let width = $state(0);
	let height = $state(0);
	let activeEntity = $derived(entities.find((entity) => entity.active));
	let cleanup = () => {};

	onMount(() => {
		gridSettings.registerItem(item);
		if (!active && gridSettings.itemSize) {
			const newPosition = calcPosition(item, {
				itemSize: gridSettings.itemSize,
				gap: gridSettings.gap
			});
			left = newPosition.left;
			top = newPosition.top;
			width = newPosition.width;
			height = newPosition.height;
		}

		if (!active && item) {
			previewItem = item;
		}
		return () => {
			gridSettings.unregisterItem(item);
		};
	});

	let previewItem = $state({ ...item });
	let preview = $derived(
		calcPosition(previewItem, {
			itemSize: gridSettings.itemSize,
			gap: gridSettings.gap
		})
	);

	function applyPreview() {
		item.x = previewItem.x;
		item.y = previewItem.y;
		item.w = previewItem.w;
		item.h = previewItem.h;
		let previewPos = calcPosition(previewItem, {
			gap: gridSettings.gap,
			itemSize: gridSettings.itemSize
		});
		left = previewPos.left;
		top = previewPos.top;
		width = previewPos.width;
		height = previewPos.height;
	}
	function scroll() {
		// TODO: scroll
	}
	// INTERACTION LOGIC
	let itemRef = $state<HTMLDivElement>();
	let initialPointerPosition = $state({ left: 0, top: 0 });
	function initInteraction(event: PointerEvent) {
		active = true;
		initialPointerPosition.left = event.pageX;
		initialPointerPosition.top = event.pageY;
		itemRef?.setPointerCapture(event.pointerId);
	}
	function endInteraction(event: PointerEvent) {
		applyPreview();
		active = false;
		initialPointerPosition.left = 0;
		initialPointerPosition.top = 0;
		itemRef?.releasePointerCapture(event.pointerId);
	}
	// MOVE ITEM LOGIC
	let initialPosition = $state({ left: 0, top: 0 });
	let pointerShift = $state({ left: 0, top: 0 });

	function moveStart(event: PointerEvent) {
		if (event.button !== 0) return;
		initInteraction(event);
		initialPosition = { left, top };
		pointerShift = { left: event.pageX - left, top: event.pageY - top };
		cleanup = on(window, 'pointermove', move);
	}

	function move(event: PointerEvent) {
		if (!gridSettings.itemSize) {
			throw new Error('Grid is not mounted yet');
		}
		let _left = event.pageX - initialPointerPosition.left + initialPosition.left;
		let _top = event.pageY - initialPointerPosition.top + initialPosition.top;
		if (gridSettings.bounds && gridSettings.boundsTo) {
			const parentRect = gridSettings.boundsTo.getBoundingClientRect();
			if (_left < parentRect.left) {
				_left = parentRect.left;
			}
			if (_top < parentRect.top) {
				_top = parentRect.top;
			}
			if (_left + width > parentRect.right) {
				_left = parentRect.right - width;
			}
			if (_top + height > parentRect.bottom) {
				_top = parentRect.bottom - height;
			}
		}
		left = _left;
		top = _top;
		if (gridSettings.collision === 'none') {
			scroll();
		}
		{
			const { x, y } = snapOnMove(left, top, previewItem, gridSettings);
			if (!hasCollisions({ ...previewItem, x, y }, Object.values(gridSettings.items))) {
				previewItem = { ...previewItem, x, y };
			}
		}
	}
	function moveEnd(event: PointerEvent, cleanup: () => void) {
		if (event.button !== 0 || !active) return;
		pointerShift = { left: 0, top: 0 };
		endInteraction(event);
		cleanup();
	}
</script>

{#snippet gridItemContent()}
	<div class="flex w-full place-items-center justify-between">
		<GridItemTabs {entities}>
			<div class="flex place-items-center">
				<span class="touch-none select-none px-1 {item.moveable ? 'opacity-100' : 'opacity-50'}">
					<img src="/Move.png" class="h-7 w-7 dark:invert" alt="move" />
				</span>
				<button class="btn btn-sm touch-none select-none px-1 hover:variant-ghost">
					<img src="/Resize.png" class="h-7 w-7 dark:invert" alt="resize" />
				</button>
			</div>
		</GridItemTabs>
	</div>
	{#if activeEntity}
		{@render gridItem(activeEntity)}
	{/if}
{/snippet}

<!-- <svelte:window  /> -->

<div
	class="absolute transition-all {classes} {active ? 'opacity-90' : ''} {item.moveable
		? 'border'
		: ''}"
	style={`left:${left}px; top:${top}px; width: ${width}px; height: ${height}px;`}
	bind:this={itemRef}
	onpointerdown={item.moveable ? moveStart : null}
	onpointerup={(e) => moveEnd(e, cleanup)}
>
	{@render gridItemContent()}
</div>

{#if active}
	<div
		class="{classes} border opacity-50 transition-all"
		style={`position: absolute; left:${preview.left}px; top:${preview.top}px;  
		width: ${preview.width}px; height: ${preview.height}px; z-index: -10;`}
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
