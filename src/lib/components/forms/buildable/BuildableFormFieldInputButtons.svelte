<script lang="ts">
	import { buildableFieldCreate, buildableFieldPlacedInBounds, buildableFormFields } from '..';
	import type { GridSettings } from '../../user-grid';
	import type { BuildableField, BuildableFieldDefault } from './fields';

	type Props = {
		draggedField: BuildableField | null;
		dragEvent: DragEvent | null;
		entityFormId: string;
		gridSettings: GridSettings;
		ondragstart?: (e: DragEvent, field: BuildableField) => void;
		ondragend?: (field: BuildableField) => void;
	};
	let {
		draggedField = $bindable(),
		dragEvent = $bindable(),
		entityFormId,
		gridSettings,
		ondragstart: _ondragstart,
		ondragend: _ondragend
	}: Props = $props();

	function ondragstart(e: DragEvent, fieldDefault: BuildableFieldDefault) {
		draggedField = buildableFieldCreate({
			e,
			entityId: entityFormId,
			field: fieldDefault,
			gridSettings
		});
		dragEvent = e;
		_ondragstart?.(e, draggedField);
	}
	function ondragend(e: DragEvent, field: BuildableFieldDefault) {
		if (!draggedField) return;
		draggedField = buildableFieldCreate({
			e,
			entityId: entityFormId,
			field,
			gridSettings
		});
		draggedField = buildableFieldPlacedInBounds({
			item: draggedField,
			gridSettings
		});
		let draggedFieldCopy = { ...draggedField };
		draggedField = null;
		dragEvent = null;
		_ondragend?.(draggedFieldCopy);
	}
</script>

{#each Object.entries(buildableFormFields) as [element_type, elements]}
	<div class="col-span-2 mb-4 flex flex-col">
		<span class="col-span-2 my-2 px-2"
			>{element_type
				.slice(0, 1)
				.concat(element_type.slice(1, element_type.length).toLowerCase())}</span
		>
		<hr class="divider border-surface-500-400-token mt-1" />
	</div>
	<div class="mb-4 grid auto-cols-max grid-cols-2 gap-2">
		{#each Object.values(elements) as field}
			<!-- {@const Icon = field.component.icon} -->
			<!-- <button -->
			<!-- 	draggable={true} -->
			<!-- 	ondragstart={(e) => ondragstart(e, field)} -->
			<!-- 	ondragend={(e) => ondragend(e, field)} -->
			<!-- 	class="variant-ghost border-surface-500-400-token btn h-full max-w-36 border" -->
			<!-- > -->
			<!-- 	<span class="rounded-token"> -->
			<!-- 		<Icon size={20} /> -->
			<!-- 	</span> -->
			<!-- 	<span class="whitespace-break-spaces">{field.component.title}</span> -->
			<!-- </button> -->
		{/each}
	</div>
{/each}
