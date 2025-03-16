<script lang="ts">
	import { Grid, GridItem, setGridContext } from '$lib/components/user-grid';
	import { slide } from 'svelte/transition';
	import { buildableFormFields } from '$src/lib/components/forms';
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
  0. Give enough space for the component menu
  */
	let formMenuOpen = $state(false);
	let draggedField = $state<
		(typeof buildableFormFields)[keyof typeof buildableFormFields] | undefined
	>();
	let previewDraggedFieldItem: LayoutItem | undefined = $state();
</script>

<div class="flex h-full w-full flex-col">
	<div class="flex h-fit w-full justify-between px-4 pt-4">
		<input class="input w-24" value="" />
		<div class="relative flex gap-x-2">
			<button onclick={() => (formMenuOpen = !formMenuOpen)} class="variant-ghost btn"
				>+ Elements</button
			>
		</div>
	</div>
	<div class="flex h-full w-full">
		<Grid {gridSettings} bind:draggedField bind:previewDraggedFieldItem class="mx-4 mb-4 border">
			{#each items as _, i}
				<GridItem class="card rounded-token" item={items[i]} entities={data.entities}>
					{#snippet gridItem(entity)}
						<div>{entity.label}</div>
						<div>hi</div>
					{/snippet}
				</GridItem>
			{/each}
		</Grid>
		<div class="relative z-10 flex h-full w-fit flex-col">
			{#if formMenuOpen}
				<div
					transition:slide={{ axis: 'x' }}
					class="bg-surface-100-800-token absolute right-0 grid h-full
          w-fit auto-rows-min grid-cols-[auto_auto] gap-5 p-4 shadow-xl shadow-gray-600"
				>
					{#each Object.values(buildableFormFields) as field}
						{@const Icon = field.component.icon}
						<button
							draggable={true}
							ondragstart={() => {
								draggedField = field;
							}}
							ondragend={(e) => {
								draggedField = undefined;
							}}
							class="variant-ghost btn btn-sm w-fit"
						>
							<span class="border border-surface-900 p-1 rounded-token">
								<Icon size={20} />
							</span>
							<span class="text-base">{field.component.title}</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
