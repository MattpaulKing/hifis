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
	import type { Snippet } from 'svelte';
	import type { ELEMENT_TYPES } from '$routes/[orgLabel]/custom-entities/schema/entityFields';
	import BuildableElementButton from '../elements/BuildableElementButton.svelte';

	type Props = {
		idx: number;
		elementType: keyof typeof ELEMENT_TYPES;
		boundingElement: HTMLElement;
		eventHandlers?: Parameters<typeof events>[0];
		class?: string;
		children: Snippet;
	};
	let {
		idx,
		elementType,
		boundingElement,
		eventHandlers,
		class: classes,
		children
	}: Props = $props();

	let controller = getBuildableGridController();

	const positionComp = Compartment.of(() =>
		position({
			default: {
				x: controller.items[elementType][idx].layout.x,
				y: controller.items[elementType][idx].layout.y
			},
			current: {
				x: controller.items[elementType][idx].layout.x,
				y: controller.items[elementType][idx].layout.y
			}
		})
	);
	const eventsComp = Compartment.of(() =>
		events({
			onDragStart(data) {
				eventHandlers?.onDragStart?.(data);
			},
			onDrag(data) {
				controller.setDragIdx({ elementType, idx });
				eventHandlers?.onDrag?.(data);
			},
			onDragEnd(data) {
				eventHandlers?.onDragEnd?.(data);
			}
		})
	);
	const gridComp = Compartment.of(() => grid([controller.gridSize, controller.gridSize]));
	const boundsComp = Compartment.of(() => bounds(BoundsFrom.element(boundingElement)));
	let itemId = $derived(controller.items[elementType][idx].properties.id);

	$inspect(controller.items[elementType][idx].layout.x);
</script>

<div
	{@attach draggable(() => [
		positionComp,
		eventsComp,
		gridComp,
		boundsComp,
		scrollLock({ lockAxis: 'x' })
	])}
	bind:this={controller.items[elementType][idx].layout.element}
	onclick={() => controller.setMenu({ elementType, idx })}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === 'Space') {
			controller.setMenu({ elementType, idx });
		}
	}}
	transition:fade
	role="gridcell"
	tabindex="0"
	style="width: {controller.items[elementType][idx].layout.widthGridUnits * controller.gridSize}px;
    height: {controller.items[elementType][idx].layout.heightGridUnits * controller.gridSize}px;"
	class="{classes} border border-dashed {itemId in controller.items[elementType]
		? 'border-warning-300-600-token'
		: itemId === controller.menu.fieldId || itemId === controller.menu.blockId
			? 'border-primary-300-600-token'
			: 'border-surface-300-600-token'} group absolute cursor-move overflow-hidden p-1 transition-transform rounded-token [&>div>input]:cursor-default [&>div>label]:cursor-move [&>div]:cursor-move"
>
	<BuildableElementMenu {elementType} {idx} />
	{@render children()}
</div>
