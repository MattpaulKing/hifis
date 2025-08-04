<script lang="ts">
	import { ExpandIcon, TrashIcon } from '@lucide/svelte';
	import { getBuildableGridController } from '../BuildableGridController.svelte';
	import type { ELEMENT_TYPES } from '$routes/[orgLabel]/custom-entities/schema/entityFields';
	let {
		elementType,
		idx,
		onDelete,
		onResize
	}: {
		elementType: keyof typeof ELEMENT_TYPES;
		idx: number;
		onDelete?: () => void;
		onResize?: () => void;
	} = $props();
	let controller = getBuildableGridController();
</script>

<div class="flex h-fit w-full justify-end">
	<button
		onclick={(e) => {
			e.stopImmediatePropagation();
			controller.handleDelete({ elementType, i: idx });
			onDelete?.();
		}}
		class="variant-ghost btn-icon btn-icon-sm transition-colors rounded-token hover:variant-filled-error"
	>
		<TrashIcon />
	</button>
	<button
		onpointerdown={(e) => {
			e.stopImmediatePropagation();
			controller.resizeMouseStart({ e, elementType, idx });
			onResize?.();
		}}
		class="variant-ghost btn-icon btn-icon-sm transition-colors rounded-token hover:variant-filled"
	>
		<ExpandIcon />
	</button>
</div>
