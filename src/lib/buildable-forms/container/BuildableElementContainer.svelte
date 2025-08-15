<script lang="ts">
	import {
		bounds,
		BoundsFrom,
		Compartment,
		draggable,
		events,
		grid,
		position,
		scrollLock
	} from '@neodrag/svelte';
	import { BuildableElementMenu, getBuildableGridController } from '$lib/buildable-forms';
	import { fade } from 'svelte/transition';
	import { getToaster } from '$src/lib/components/toast';
	import type { Snippet } from 'svelte';
	import type { ELEMENT_TYPES } from '$routes/[orgLabel]/custom-entities/schema/entityFields';
	import {
		entityBlockLayoutUpsert,
		entityFieldLayoutUpsert
	} from '$routes/[orgLabel]/custom-entities/lib';

	type Props = {
		idx: number;
		elementType: keyof typeof ELEMENT_TYPES;
		boundingElement: HTMLElement;
		eventHandlers?: Parameters<typeof events>[0];
		onPositionChange?: () => void;
		onResize?: () => void;
		onDelete?: () => void;
		class?: string;
		children: Snippet;
	};
	let {
		idx,
		elementType,
		boundingElement,
		eventHandlers,
		onPositionChange,
		onResize,
		onDelete,
		class: classes,
		children
	}: Props = $props();

	let toaster = getToaster();
	let controller = getBuildableGridController();
	let validPos = $state({
		x: controller.items[elementType][idx].layouts[controller.view].x,
		y: controller.items[elementType][idx].layouts[controller.view].y
	});
	$effect(() => {
		validPos = {
			x: controller.items[elementType][idx].layouts[controller.view].x,
			y: controller.items[elementType][idx].layouts[controller.view].y
		};
	});

	const positionComp = Compartment.of(() => position({ current: validPos }));
	const eventsComp = Compartment.of(() =>
		events({
			onDragStart(data) {
				validPos = data.offset;
				eventHandlers?.onDragStart?.(data);
			},
			onDrag(data) {
				controller.setDragIdx({ elementType, idx });
				validPos = data.offset;
				eventHandlers?.onDrag?.(data);
			},
			async onDragEnd(data) {
				if (
					controller.hasCollisions({
						...controller.items[elementType][idx].layouts[controller.view],
						...validPos
					})
				) {
					validPos = {
						x: controller.items[elementType][idx].layouts[controller.view].x,
						y: controller.items[elementType][idx].layouts[controller.view].y
					};
					toaster.add({
						type: 'error',
						message: `${elementType} cannot overlap.`
					});
				} else {
					controller.items[elementType][idx].layouts[controller.view].x = validPos.x;
					controller.items[elementType][idx].layouts[controller.view].y = validPos.y;
					if (elementType === 'fields') {
						await entityFieldLayoutUpsert(
							controller.items[elementType][idx].layouts[controller.view]
						);
					} else if (elementType === 'blocks') {
						await entityBlockLayoutUpsert(
							controller.items[elementType][idx].layouts[controller.view]
						);
					}
					onPositionChange?.();
				}
				eventHandlers?.onDragEnd?.(data);
			}
		})
	);
	const gridComp = Compartment.of(() => grid([controller.gridSize, controller.gridSize]));
	const boundsComp = Compartment.of(() => bounds(BoundsFrom.element(boundingElement)));
	let itemId = $derived(controller.items[elementType][idx].id);
</script>

<div
	{@attach draggable(() => [
		positionComp,
		eventsComp,
		gridComp,
		boundsComp,
		scrollLock({ lockAxis: 'x' })
	])}
	onclick={() => controller.setMenu({ elementType, idx })}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === 'Space') {
			controller.setMenu({ elementType, idx });
		}
	}}
	transition:fade
	role="gridcell"
	tabindex="0"
	style="width: {controller.items[elementType][idx].layouts[controller.view].widthGridUnits *
		controller.gridSize}px;
    height: {controller.items[elementType][idx].layouts[controller.view].heightGridUnits *
		controller.gridSize}px;"
	class="{classes} border border-dashed {itemId in controller.items[elementType]
		? 'border-warning-300-600-token'
		: itemId === controller.menu.fieldId || itemId === controller.menu.blockId
			? 'border-primary-300-600-token'
			: 'border-surface-300-600-token'} group absolute cursor-move overflow-hidden p-1 transition-transform rounded-token [&>div>input]:cursor-default [&>div>label]:cursor-move [&>div]:cursor-move"
>
	<BuildableElementMenu {elementType} {idx} {onResize} {onDelete} />
	{@render children()}
</div>
