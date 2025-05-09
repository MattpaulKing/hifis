<script lang="ts">
	import { getGridContext, GridItemState } from '../../user-grid';
	import { onMount, type Snippet } from 'svelte';
	import { getBuildableFormFieldMenuState } from '..';
	import { ScalingIcon, TrashIcon } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import type { BuildableField, BuildableFieldPreview } from './fields';
	import { enhance } from '$app/forms';
	import { route } from '$src/lib/ROUTES';
	import { page } from '$app/state';

	type Props = {
		fieldId: string;
		item: Omit<BuildableField['layout'], 'id'> & { id: string };
		min: BuildableFieldPreview['layout']['min'];
		onDelete: (_item: typeof item) => void;
		moveable?: BuildableFieldPreview['layout']['moveable'];
		resizeable?: BuildableFieldPreview['layout']['resizeable'];
		dragEvent?: DragEvent;
		children: Snippet;
		onclick?: (e: MouseEvent) => void;
		onkeydown?: (e: KeyboardEvent) => void;
		onChanged?: (item: BuildableField['layout']) => void;
		onMoveEnd?: (item: BuildableField['layout']) => void;
		onResizeEnd?: (item: BuildableField['layout']) => void;
		onDestroy?: () => void;
		class?: string;
	};
	let {
		fieldId,
		item,
		min,
		resizeable = true,
		moveable = true,
		dragEvent,
		onChanged,
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
	let controller = new GridItemState({ item, min, moveable, resizeable, onChanged });

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
	out:fade
	role="gridcell"
	tabindex="0"
	class=" absolute cursor-move overflow-hidden
  p-2 transition-transform rounded-token
  [&>div>input]:cursor-move [&>div>label]:cursor-move [&>div]:cursor-move
  {classes} {buildableFormFieldMenuState.state.field?.layout.id === item.id
		? 'border-primary-500-400-token border border-solid'
		: 'border-primary-200-700-token border border-dashed'} 
  {controller.active && !dragEvent ? 'opacity-60' : dragEvent ? 'opacity-0' : ''}"
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
		<form
			action={route('delete /[orgLabel]/custom-entities/properties', {
				orgLabel: page.data.org.label
			})}
			method="POST"
			use:enhance
		>
			<button
				class="variant-ghost btn-icon btn-icon-sm rounded-token hover:variant-filled-error"
				name="fieldId"
				value={fieldId}
				onpointerdown={(e) => e.stopPropagation()}
				onclick={(e) => {
					e.stopPropagation();
					onDelete(controller.item);
				}}
			>
				<TrashIcon />
			</button>
		</form>
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
		class="{classes} border-primary-500-400-token overflow-hidden border p-2 opacity-80 transition-transform rounded-token"
		style={`position: absolute; left:${controller.preview.left}px; top:${controller.preview.top}px;  
		width: ${controller.preview.width}px; height: ${controller.preview.height}px;`}
	>
		{@render children()}
	</div>
{/if}
