<script lang="ts">
	import { getGridContext, GridItemState } from '../../user-grid';
	import { onMount, type Snippet } from 'svelte';
	import { getBuildableFormFieldMenuState } from '..';
	import { ScalingIcon, TrashIcon } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import type { BuildableField, BuildableFieldPreview } from './fields';

	type Props = {
		item: Omit<BuildableField['layout'], 'id'> & { id: string };
		min: BuildableFieldPreview['layout']['min'];
		onDelete: (_item: typeof item) => void;
		moveable?: BuildableFieldPreview['layout']['moveable'];
		resizeable?: BuildableFieldPreview['layout']['resizeable'];
		dragEvent?: DragEvent;
		children: Snippet;
		onclick?: (e: MouseEvent) => void;
		onkeydown?: (e: KeyboardEvent) => void;
		onMoveEnd?: (item: BuildableField['layout']) => void;
		onResizeEnd?: (item: BuildableField['layout']) => void;
		onDestroy?: () => void;
		class?: string;
	};
	let {
		item,
		min,
		resizeable = true,
		moveable = true,
		dragEvent,
		onDelete,
		onMoveEnd,
		onResizeEnd,
		onclick,
		onkeydown,
		class: classes,
		children,
		onDestroy: _onDestroy
	}: Props = $props();

	let gridSettings = getGridContext();
	let controller = new GridItemState({ item, min, moveable, resizeable });

	onMount(() => {
		controller.init();
		if (dragEvent) {
			controller.moveStartMouse(dragEvent);
		} else {
			gridSettings.registerItem(controller.item);
		}
		return () => {
			if (!dragEvent) {
				gridSettings.unregisterItem(controller.item);
			}
		};
	});
	let buildableFormFieldMenuState = getBuildableFormFieldMenuState();
</script>

<div
	transition:fade
	role="gridcell"
	tabindex="0"
	class="border-primary-500-400-token absolute cursor-move overflow-hidden
  p-2 transition-transform rounded-token
  [&>div>input]:cursor-move [&>div>label]:cursor-move [&>div]:cursor-move
  {classes} {buildableFormFieldMenuState.state.field?.layout.id === item.id
		? 'border border-dashed'
		: ''} 
  {controller.active && !dragEvent ? 'opacity-80' : dragEvent ? 'opacity-0' : ''}"
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
	<div class="absolute right-1 top-1 flex gap-x-1">
		<button
			class="variant-ghost btn-icon btn-icon-sm rounded-token hover:variant-filled-error"
			onpointerdown={(e) => e.stopPropagation()}
			onclick={(e) => {
				e.stopPropagation();
				onDelete(controller.item);
			}}
		>
			<TrashIcon />
		</button>
		<button
			class="variant-ghost btn-icon btn-icon-sm rounded-token hover:variant-filled"
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
	</div>
	{@render children()}
</div>

{#if controller.active}
	<div
		class="{classes} border-primary-500-400-token overflow-hidden border border-dashed p-2 opacity-40 transition-transform rounded-token"
		style={`position: absolute; left:${controller.preview.left}px; top:${controller.preview.top}px;  
		width: ${controller.preview.width}px; height: ${controller.preview.height}px;`}
	>
		{@render children()}
	</div>
{/if}
