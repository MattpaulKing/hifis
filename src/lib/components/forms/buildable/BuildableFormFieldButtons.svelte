<script lang="ts">
	import { buildableFieldDefault, buildableFormFields } from '..';
	import type { GridSettings } from '../../user-grid';
	import type { BuildableFieldPreview } from './fields';

	type Props = {
		draggedField: BuildableFieldPreview | null;
		entityFormId: string;
		gridSettings: GridSettings;
		ondragstart?: (e: DragEvent, field: BuildableFieldPreview) => void;
		ondragend: (e: DragEvent) => void;
	};
	let {
		draggedField = $bindable(),
		entityFormId,
		gridSettings,
		ondragstart: _ondragstart,
		ondragend
	}: Props = $props();

	function ondragstart(e: DragEvent, field: BuildableFieldPreview) {
		draggedField = buildableFieldDefault({
			e,
			entityId: entityFormId,
			field,
			gridSettings
		});
		_ondragstart?.(e, field);
	}
</script>

<div class="col-span-2 mb-4 flex flex-col">
	<span class="col-span-2 my-2 px-2">Fields</span>
	<hr class="divider border-surface-500-400-token mt-1" />
</div>
<div class="flex flex-wrap gap-4">
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
</div>
