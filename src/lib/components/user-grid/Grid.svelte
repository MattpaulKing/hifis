<script lang="ts">
	import { GridSettings } from '.';
	import type { Snippet } from 'svelte';

	type Props = {
		gridSettings: GridSettings;
		class?: string;
		autoCompress?: boolean;
		ondragover?: (e: DragEvent) => void;
		children: Snippet;
		fieldPreview?: Snippet<[{ dragEvent: DragEvent | undefined }]>;
	};
	let {
		gridSettings,
		class: classes,
		ondragover: _ondragover,
		children,
		fieldPreview
	}: Props = $props();

	function ondragover(e: DragEvent) {
		dragEvent = e;
		_ondragover?.(e);
	}
	let dragEvent = $state<DragEvent>();
</script>

<div
	{ondragover}
	role="grid"
	tabindex="0"
	class="relative h-full w-full {classes}"
	bind:this={gridSettings.boundsTo}
>
	{#if gridSettings.itemSize && gridSettings.boundsTo}
		{@render children()}
		{@render fieldPreview?.({ dragEvent })}
	{/if}
</div>
