<script lang="ts">
	import { buildableFieldDefault, buildableFormFields } from '..';
	import type { GridSettings } from '../../user-grid';
	import { getValidCoordsIfCollisionOrOutsideBounds } from '../../user-grid/utils/grid';
	import Label from '../Label.svelte';
	import type { BuildableFieldPreview } from './fields';

	type Props = {
		draggedField: BuildableFieldPreview | null;
		dragEvent: DragEvent | null;
		entityFormId: string;
		gridSettings: GridSettings;
		ondragstart?: (e: DragEvent, field: BuildableFieldPreview) => void;
		ondragend?: (field: BuildableFieldPreview) => void;
	};
	let {
		draggedField = $bindable(),
		dragEvent = $bindable(),
		entityFormId,
		gridSettings,
		ondragstart: _ondragstart,
		ondragend: _ondragend
	}: Props = $props();

	function ondragstart(e: DragEvent, fieldDefault: BuildableFieldPreview) {
		draggedField = buildableFieldDefault({
			e,
			entityId: entityFormId,
			field: fieldDefault,
			gridSettings
		});
		dragEvent = e;
		_ondragstart?.(e, draggedField);
	}
	function ondragend(e: DragEvent, field: BuildableFieldPreview) {
		if (!draggedField) return;
		draggedField = buildableFieldDefault({
			e,
			entityId: entityFormId,
			field,
			gridSettings
		});
		let draggedFieldCopy = { ...draggedField };
		draggedField = null;
		dragEvent = null;
		_ondragend?.(draggedFieldCopy);
	}
</script>

<div class="col-span-2 mb-4 flex flex-col">
	<span class="col-span-2 my-2 px-2">Fields</span>
	<hr class="divider border-surface-500-400-token mt-1" />
</div>
<div class="flex flex-wrap gap-2">
	{#each Object.values(buildableFormFields) as field}
		{@const Icon = field.component.icon}
		<button
			draggable={true}
			ondragstart={(e) => ondragstart(e, field)}
			ondragend={(e) => ondragend(e, field)}
			class="variant-ghost border-surface-500-400-token btn h-10 w-fit border"
		>
			<span class="rounded-token">
				<Icon size={20} />
			</span>
			<span class="">{field.component.title}</span>
		</button>
	{/each}
</div>
