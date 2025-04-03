<script lang="ts">
	import { getGridContext, GridItemState } from '../../user-grid';
	import { onMount, type Snippet } from 'svelte';
	import { getBuildableFormFieldMenuState } from '..';
	import type { BuildableField } from './fields';

	type Props = {
		item: BuildableField['layout'];
		children: Snippet;
		onclick?: (e: MouseEvent) => void;
		onkeydown?: (e: KeyboardEvent) => void;
		class?: string;
	};
	let { item, onclick, onkeydown, class: classes, children }: Props = $props();

	let gridSettings = getGridContext();
	let controller = new GridItemState({ item });

	onMount(() => {
		controller.init();
		gridSettings.registerItem(controller.item);
		return () => {
			gridSettings.unregisterItem(controller.item);
		};
	});
	let buildableFormFieldMenuState = getBuildableFormFieldMenuState();
</script>

<div
	role="gridcell"
	tabindex="0"
	class="border-primary-500-400-token absolute transition-transform rounded-token {classes} {controller.active
		? 'opacity-80 '
		: ''} {controller.active || buildableFormFieldMenuState.state.field?.layout.id === item.id
		? 'border'
		: ''}"
	style={`left:${controller.left}px; top:${controller.top}px; width: ${controller.width}px; height: ${controller.height}px;`}
	bind:this={controller.moveableEl}
	onpointerdown={(e) => (controller.item.moveable ? controller.moveStartMouse(e) : null)}
	ontouchstart={(e) => (controller.item.moveable ? controller.moveStartTouch(e) : null)}
	{onclick}
	{onkeydown}
>
	{@render children()}
</div>

{#if controller.active}
	<div
		class="{classes} borde border-primary-500-400-token opacity-50 transition-transform"
		style={`position: absolute; left:${controller.preview.left}px; top:${controller.preview.top}px;  
		width: ${controller.preview.width}px; height: ${controller.preview.height}px; z-index: -10;`}
	>
		{@render children()}
	</div>
{/if}
