<script lang="ts">
	import { Grid, GridItem, setGridContext } from '$lib/components/user-grid';
	import {
		BuildableFieldPreview,
		buildableFormFields,
		previewFieldItemFromFieldSettings
	} from '$src/lib/components/forms';
	import type { LayoutItem } from '$src/lib/components/user-grid/types.js';

	let { data } = $props();

	let items = $state(data.usersComponents);
	let cellSize = 32;
	let gridSettings = setGridContext({
		cols: 0,
		rows: 0,
		itemSize: { width: cellSize, height: cellSize },
		bounds: true,
		gap: cellSize,
		readOnly: false
	});
	/*
  TODO: 
    0. Figure out how I'm going to create the schema on the fly...
  */
	let draggedField = $state<
		(typeof buildableFormFields)[keyof typeof buildableFormFields] | undefined
	>();
	let previewDraggedFieldItem: LayoutItem | undefined = $state();
	function ondragend() {
		if (!previewDraggedFieldItem) return;
		items.push(previewDraggedFieldItem);
		draggedField = undefined;
	}
	function ondragover(e: DragEvent) {
		if (!draggedField) return;
		previewDraggedFieldItem = previewFieldItemFromFieldSettings({
			e,
			fieldSettings: draggedField,
			itemSize: gridSettings.itemSize,
			gap: gridSettings.gap
		});
	}
</script>

<div class="flex h-full w-full">
	<div class="flex h-full w-full p-4">
		<Grid {ondragover} {gridSettings} class="border ">
			{#each items as _, i}
				<GridItem class="card rounded-token" item={items[i]} entities={data.entities}>
					{#snippet gridItem(entity)}
						<div>{entity.label}</div>
						<div>hi</div>
					{/snippet}
				</GridItem>
			{/each}
			{#snippet fieldPreview({ dragEvent })}
				{#if draggedField && previewDraggedFieldItem && dragEvent}
					{@const Field = draggedField.component.render}
					<BuildableFieldPreview item={previewDraggedFieldItem} {dragEvent}>
						<Field />
					</BuildableFieldPreview>
				{/if}
			{/snippet}
		</Grid>
	</div>
	<div
		class="bg-surface-200-700-token grid h-full
          w-fit auto-rows-min grid-cols-[auto_auto] gap-5 p-4"
	>
		<span class="col-span-2 text-lg font-bold">Elements</span>
		<div class="col-span-2 -mb-2 flex flex-col">
			<span class="col-span-2 px-2">Fields</span>
			<hr class="divider border-surface-500-400-token mt-1" />
		</div>
		{#each Object.values(buildableFormFields) as field}
			{@const Icon = field.component.icon}
			<button
				draggable={true}
				ondragstart={() => {
					draggedField = field;
				}}
				{ondragend}
				class="variant-ghost btn btn-sm w-fit"
			>
				<span class="border border-surface-900 p-1 rounded-token">
					<Icon size={20} />
				</span>
				<span class="">{field.component.title}</span>
			</button>
		{/each}
	</div>
</div>
