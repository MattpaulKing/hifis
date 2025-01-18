<!--@component?
min: minimum size of item in Grid Units
max: maximum size of item in Grid Units
-->

<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { coordinate2size, calcPosition, snapOnMove, snapOnResize } from './utils/item';
	import { hasCollisions, getCollisions, getAvailablePosition } from './utils/grid';
	import { getGridContext } from './utils/gridContext.svelte';
	import type { ItemSize, LayoutItem, Size } from './types';
	let gridSettings = getGridContext();
	type Props = {
		id: string;
		activeClass?: string;
		previewClass?: string;
		x: number;
		y: number;
		w: number;
		h: number;
		min?: Size;
		max?: Size;
		moveable?: boolean;
		resizable?: boolean;
		onChange?: (item: LayoutItem) => void;
		onPreview?: (item: LayoutItem) => void;
		gridItem: Snippet;
		class?: string;
	};
	let {
		id,
		activeClass,
		previewClass,
		class: classes,
		x = $bindable(),
		y = $bindable(),
		w = $bindable(),
		h = $bindable(),
		min = { h: 1, w: 1 },
		max,
		moveable = true,
		resizable = true,
		gridItem,
		onChange,
		onPreview
	}: Props = $props();
	let active = $state(false);
	let left: number = $state();
	let top: number = $state();
	let width: number = $state();
	let height: number = $state();

	let item = $derived({
		id,
		x,
		y,
		w,
		h,
		min,
		max,
		moveable,
		resizable
	});

	onMount(() => {
		gridSettings.registerItem(item);
		return () => {
			gridSettings.unregisterItem(item);
		};
	});
	// reposition item on grid change
	$effect(() => {
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
		if (onPreview) {
			onPreview(previewItem);
		}
	});

	let previewItem = item;

	function applyPreview() {
		item.x = previewItem.x;
		item.y = previewItem.y;
		item.w = previewItem.w;
		item.h = previewItem.h;
	}
	function scroll() {
		// TODO: scroll
	}
	// INTERACTION LOGIC
	let itemRef: HTMLDivElement;
	const initialPointerPosition = { left: 0, top: 0 };
	function initInteraction(event: PointerEvent) {
		active = true;
		initialPointerPosition.left = event.pageX;
		initialPointerPosition.top = event.pageY;
		itemRef.setPointerCapture(event.pointerId);
	}
	function endInteraction(event: PointerEvent) {
		applyPreview();
		active = false;
		initialPointerPosition.left = 0;
		initialPointerPosition.top = 0;
		itemRef.releasePointerCapture(event.pointerId);
	}
	// MOVE ITEM LOGIC
	let initialPosition = { left: 0, top: 0 };
	let pointerShift = { left: 0, top: 0 };
	function moveStart(event: PointerEvent) {
		console.log('hit');
		if (event.button !== 0) return;
		initInteraction(event);
		initialPosition = { left, top };
		pointerShift = { left: event.pageX - left, top: event.pageY - top };
		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', moveEnd);
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
		// TODO: throttle this, hasColisions is expensive
		{
			const { x, y } = snapOnMove(left, top, previewItem, gridSettings);
			if (gridSettings.collision !== 'none') {
				movePreviewWithCollisions(x, y);
			} else {
				if (!hasCollisions({ ...previewItem, x, y }, Object.values(gridSettings.items))) {
					previewItem = { ...previewItem, x, y };
				}
			}
		}
	}
	function updateCollItemPositionWithPush(collItem: LayoutItem, items: LayoutItem[]) {
		//TODO: This may need an actual reference
		const newPosition = getAvailablePosition(
			collItem,
			items,
			gridSettings.maxCols,
			gridSettings.maxRows
		);
		if (newPosition) {
			const { x, y } = newPosition;
			collItem.x = x;
			collItem.y = y;
		}
	}
	function handleCollisionsForPreviewItemWithPush(newAttributes) {
		const gridItems = Object.values(gridSettings.items);
		const itemsExceptPreview = gridItems.filter((item) => item.id != previewItem.id);
		const collItems = getCollisions({ ...previewItem, ...newAttributes }, itemsExceptPreview);
		collItems.forEach((collItem) => {
			const itemsExceptCollItem = gridItems.filter((item) => item.id != collItem.id);
			const items = [
				...itemsExceptCollItem.filter((item) => item.id != previewItem.id),
				{ ...previewItem, ...newAttributes }
			];
			updateCollItemPositionWithPush(collItem, items);
		});
		previewItem = { ...previewItem, ...newAttributes };
		applyPreview();
	}
	function movePreviewWithCollisionsWithPush(x: number, y: number) {
		handleCollisionsForPreviewItemWithPush({ x, y });
	}
	function movePreviewWithCollisionsWithCompress(x: number, y: number) {
		const gridItems = Object.values(gridSettings.items);
		let newY = y;
		const itemsExceptPreview = gridItems.filter((item) => item.id != previewItem.id);
		while (newY >= 0) {
			const collItems = getCollisions({ ...previewItem, x, y: newY }, gridItems);
			if (collItems.length > 0) {
				const sortedItems = collItems.sort((a, b) => b.y - a.y);
				let moved = false;
				sortedItems.forEach((sortItem) => {
					//if you want to fix sensitivity of grid, change this statement
					if (y + previewItem.h / 2 >= sortItem.y + sortItem.h / 2) {
						moved = true;
						newY = sortItem.y + sortItem.h;
						sortedItems.forEach((item) => {
							if (
								!hasCollisions({ ...item, y: item.y - previewItem.h }, itemsExceptPreview) &&
								item.y - previewItem.h >= 0
							) {
								item.y -= previewItem.h;
							}
						});
						return false;
					}
				});
				if (!moved) {
					newY = previewItem.y;
				}
				break;
			}
			newY--;
		}
		if (newY < 0 || y === 0) {
			newY = 0;
		}
		const positionChanged = x != previewItem.x || newY != previewItem.y;
		previewItem = { ...previewItem, x, y: newY };
		if (positionChanged) {
			compressItems();
			applyPreview();
		}
	}
	function movePreviewWithCollisions(x: number, y: number) {
		if (gridSettings.collision === 'compress') {
			movePreviewWithCollisionsWithCompress(x, y);
		} else {
			movePreviewWithCollisionsWithPush(x, y);
		}
	}
	function moveEnd(event: PointerEvent) {
		if (event.button !== 0) return;
		endInteraction(event);
		pointerShift = { left: 0, top: 0 };
		window.removeEventListener('pointermove', move);
		window.removeEventListener('pointerup', moveEnd);
	}
	// RESIZE ITEM LOGIC
	let initialSize = { width: 0, height: 0 };
	let minSize: ItemSize;
	let maxSize: ItemSize;

	$effect(() => {
		if (gridSettings.itemSize) {
			minSize = {
				width: coordinate2size(min.w, gridSettings.itemSize.width, gridSettings.gap),
				height: coordinate2size(min.h, gridSettings.itemSize.height, gridSettings.gap)
			};
		}
	});

	let _resizable = $derived(!gridSettings.readOnly && item.resizable);
	function resizeStart(event: PointerEvent) {
		if (event.button !== 0) return;
		event.stopPropagation();
		initInteraction(event);
		initialSize = { width, height };
		window.addEventListener('pointermove', resize);
		window.addEventListener('pointerup', resizeEnd);
	}
	function resize(event: PointerEvent) {
		if (!gridSettings.itemSize) {
			throw new Error('Grid is not mounted yet');
		}
		width = event.pageX + initialSize.width - initialPointerPosition.left;
		height = event.pageY + initialSize.height - initialPointerPosition.top;
		if (gridSettings.bounds && gridSettings.boundsTo) {
			const parentRect = gridSettings.boundsTo.getBoundingClientRect();
			if (width + left > parentRect.width) {
				width = parentRect.width - left;
			}
			if (height + top > parentRect.height) {
				height = parentRect.height - top;
			}
		}
		if (minSize) {
			width = Math.max(width, minSize.width);
			height = Math.max(height, minSize.height);
		}
		//TODO: FIX
		// if (maxSize) {
		if (false) {
			width = Math.min(width, maxSize.width);
			height = Math.min(height, maxSize.height);
		}
		if (gridSettings.collision === 'none') {
			scroll;
		}
		// TODO: throttle this, hasColisions is expensive
		{
			const { w, h } = snapOnResize(width, height, previewItem, gridSettings);
			if (gridSettings.collision !== 'none') {
				resizePreviewWithCollisions(w, h);
			} else {
				if (!hasCollisions({ ...previewItem, w, h }, Object.values(gridSettings.items))) {
					previewItem = { ...previewItem, w, h };
				}
			}
		}
	}
	function resizePreviewWithCollisionsWithPush(w: number, h: number) {
		handleCollisionsForPreviewItemWithPush({ w, h });
	}
	function resizePreviewWithCollisionsWithCompress(w: number, h: number) {
		const sizeChanged = w != previewItem.w || h != previewItem.h;
		if (sizeChanged) {
			const hGap = h - previewItem.h;
			previewItem = { ...previewItem, w, h };
			applyPreview();
			const collItems = getCollisions(
				{ ...previewItem, w, h: 9999 },
				Object.values(gridSettings.items)
			);
			collItems.forEach((item) => {
				item.y += hGap;
			});
			compressItems();
		}
	}
	function resizePreviewWithCollisions(w: number, h: number) {
		if (gridSettings.collision === 'compress') {
			resizePreviewWithCollisionsWithCompress(w, h);
		} else {
			resizePreviewWithCollisionsWithPush(w, h);
		}
	}
	function resizeEnd(event: PointerEvent) {
		if (event.button !== 0) return;
		endInteraction(event);
		window.removeEventListener('pointermove', resize);
		window.removeEventListener('pointerup', resizeEnd);
	}
	function compressItems() {
		const gridItems = Object.values(gridSettings.items);
		const sortedItems = [...gridItems].sort((a, b) => a.y - b.y);
		sortedItems.reduce(
			(accItem, currentItem) => {
				if (currentItem.id === previewItem.id) {
					//if previewItem do nothing
				} else if (previewItem.y < currentItem.y + currentItem.h) {
					//compress items above previewItem
					const maxY =
						currentItem.y >= previewItem.y
							? currentItem.y + previewItem.h + 1
							: previewItem.y + currentItem.h + 1;
					let newY = maxY;
					while (newY >= 0) {
						if (hasCollisions({ ...currentItem, y: newY }, accItem)) {
							break;
						}
						newY--;
					}
					currentItem.y = newY + 1;
					accItem.push(currentItem);
				} else {
					//compress items below previewItem
					let newY = currentItem.y;
					while (newY >= 0) {
						if (hasCollisions({ ...currentItem, y: newY }, accItem)) {
							break;
						}
						newY--;
					}
					if (newY < currentItem.y && newY > 0) {
						currentItem.y = newY + 1;
					}
					accItem.push(currentItem);
				}
				return accItem;
			},
			[previewItem]
		);
	}
</script>

<div
	class={`${classes} ${active ? activeClass : ''}`}
	class:item-default={!classes}
	class:active-default={!activeClass && active}
	class:non-active-default={!active}
	onpointerdown={moveable ? moveStart : null}
	style={`position: absolute; left:${left}px; top:${top}px; width: ${width}px; height: ${height}px; 
			${moveable ? 'cursor: move;' : ''} touch-action: none; user-select: none;`}
	bind:this={itemRef}
>
	{@render gridItem()}
</div>

{#if active && gridSettings.itemSize}
	{@const preview = calcPosition(previewItem, {
		itemSize: gridSettings.itemSize,
		gap: gridSettings.gap
	})}
	<div
		class={previewClass ?? ''}
		class:item-preview-default={!previewClass}
		style={`position: absolute; left:${preview.left}px; top:${preview.top}px;  
		width: ${preview.width}px; height: ${preview.height}px; z-index: -10;`}
	></div>
{/if}

<style>
	.item-default {
		transition:
			width 0.2s,
			height 0.2s;
		transition:
			transform 0.2s,
			opacity 0.2s;
	}
	.active-default {
		opacity: 0.7;
	}
	.item-preview-default {
		background-color: rgb(192, 127, 127);
		transition: all 0.2s;
	}
	.non-active-default {
		transition:
			left 0.2s,
			top 0.2s;
		transition-timing-function: ease-in-out;
	}
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
