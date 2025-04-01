<script lang="ts">
	import { GridSettings } from '.';
	import type { Snippet } from 'svelte';
	import { setFormCtx } from '../forms/inputs/context.svelte';

	type Props = {
		gridSettings: GridSettings;
		class?: string;
		autoCompress?: boolean;
		userBuilding?: boolean;
		ondragover?: (e: DragEvent) => void;
		children: Snippet;
		fieldPreview?: Snippet<[{ dragEvent: DragEvent }]>;
	};
	let {
		gridSettings,
		class: classes,
		ondragover: _ondragover,
		userBuilding = false,
		children,
		fieldPreview
	}: Props = $props();

	function ondragover(e: DragEvent) {
		dragEvent = e;
		_ondragover?.(e);
	}
	let dragEvent = $state<DragEvent | null>(null);
	setFormCtx({ disabled: userBuilding });
</script>

<div
	{ondragover}
	onpointerleave={() => (dragEvent = null)}
	role="grid"
	tabindex="0"
	class="relative h-full w-full {classes}"
	bind:this={gridSettings.boundsTo}
>
	{#if gridSettings.itemSize && gridSettings.boundsTo}
		{@render children()}
		{#if dragEvent !== null}
			{@render fieldPreview?.({ dragEvent })}
		{/if}
	{/if}
</div>
