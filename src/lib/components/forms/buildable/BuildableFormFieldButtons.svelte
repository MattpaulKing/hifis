<script lang="ts">
	import { buildableFormFields, previewFieldItemFromFieldSettings, type BuildableField } from '..';
	import type { GridSettings } from '../../user-grid';

	type Props = {
		draggedField: BuildableField | null;
		entityFormId: string;
		gridSettings: GridSettings;
		ondragstart?: (e: DragEvent, field: BuildableField) => void;
		ondragend: (e: DragEvent) => void;
	};
	let {
		draggedField = $bindable(),
		entityFormId,
		gridSettings,
		ondragstart: _ondragstart,
		ondragend
	}: Props = $props();

	function ondragstart(e: DragEvent, field: BuildableField) {
		draggedField = previewFieldItemFromFieldSettings({
			e,
			entityId: entityFormId,
			field,
			gridSettings
		});
    _ondragstart?.(e, field)
	}
</script>

<div class="col-span-2 mb-4 flex flex-col">
	<span class="col-span-2 my-2 px-2">Fields</span>
	<hr class="divider border-surface-500-400-token mt-1" />
</div>
{#each Object.values(buildableFormFields) as field}
	{@const Icon = field.component.icon}
	<button
		draggable={true}
		ondragstart={(e) => ondragstart(e, field)}
		{ondragend}
		class="variant-ghost btn btn-sm w-fit"
	>
		<span class="p-1 rounded-token">
			<Icon size={20} />
		</span>
		<span class="">{field.component.title}</span>
	</button>
{/each}
