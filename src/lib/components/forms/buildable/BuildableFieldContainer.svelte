<script lang="ts">
	import { getGridContext, GridItemState } from '../../user-grid';
	import { onMount, type Snippet } from 'svelte';
	import { getBuildableFormFieldMenuState } from '..';
	import { ScalingIcon } from '@lucide/svelte';
	import type { BuildableField, BuildableFieldPreview } from './fields';

	type Props = {
		item: Omit<BuildableField['layout'], 'id'> & { id: string };
		min: BuildableFieldPreview['layout']['min'];
		moveable?: BuildableFieldPreview['layout']['moveable'];
		resizeable?: BuildableFieldPreview['layout']['resizeable'];
		dragEvent?: DragEvent;
		children: Snippet;
		onclick?: (e: MouseEvent) => void;
		onkeydown?: (e: KeyboardEvent) => void;
		onMoveEnd?: (item: BuildableField['layout']) => void;
		onResizeEnd?: (item: BuildableField['layout']) => void;
		class?: string;
	};
	let {
		item,
		min,
		resizeable = true,
		moveable = true,
		dragEvent,
		onMoveEnd,
		onResizeEnd,
		onclick,
		onkeydown,
		class: classes,
		children
	}: Props = $props();

	let gridSettings = getGridContext();
	let controller = new GridItemState({ item, min, moveable, resizeable });

	onMount(() => {
		controller.init();
		gridSettings.registerItem(controller.item);
		if (dragEvent) {
			controller.moveStartMouse(dragEvent);
		}
		return () => {
			gridSettings.unregisterItem(controller.item);
		};
	});
	let buildableFormFieldMenuState = getBuildableFormFieldMenuState();
</script>

<div
	role="gridcell"
	tabindex="0"
	class="border-primary-500-400-token absolute overflow-hidden p-2 transition-transform rounded-token {classes} {controller.active
		? 'opacity-50'
		: ''} {controller.active || buildableFormFieldMenuState.state.field?.layout.id === item.id
		? 'border'
		: ''}"
	style={`left:${controller.left}px; top:${controller.top}px; width: ${controller.width}px; height: ${controller.height}px;`}
	bind:this={controller.moveableEl}
	onpointerdown={(e) => {
		if (controller.item.moveable) {
			controller.moveStartMouse(e);
		}
	}}
	ontouchstart={(e) => (controller.item.moveable ? controller.moveStartTouch(e) : null)}
	onpointerup={() => onMoveEnd?.(controller.item)}
	{onclick}
	{onkeydown}
>
	<button
		class="variant-ghost btn-icon btn-icon-sm absolute right-0 top-0 rounded-token hover:variant-filled"
		onpointerdown={(e) => {
			e.stopPropagation();
			if (controller.item.resizeable) {
				controller.resizeMouseStart(e);
			}
		}}
		onpointerup={() => onResizeEnd?.(controller.item)}
	>
		<ScalingIcon />
	</button>
	{@render children()}
</div>

{#if controller.active}
	<div
		class="{classes} border-primary-500-400-token overflow-hidden border p-2 opacity-80 transition-transform"
		style={`position: absolute; left:${controller.preview.left}px; top:${controller.preview.top}px;  
		width: ${controller.preview.width}px; height: ${controller.preview.height}px; z-index: -10;`}
	>
		{@render children()}
	</div>
{/if}
