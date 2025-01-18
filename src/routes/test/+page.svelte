<script lang="ts">
	import { Debouncer } from '$lib/api';
	import { saveUserGrid, Grid, GridItem } from '$lib/components/user-grid';
	import { Tabs } from '$lib/components/user-grid';

	let outer = $state([
		{ id: '1', x: 0, y: 0, h: 10, w: 20, version: 1 },
		{ id: '2', x: 20, y: 0, h: 10, w: 20, version: 1 }
	]);
	let debouncer = new Debouncer({
		callback: async () => {
			await saveUserGrid(outer);
			return;
		}
	});
	let entities = [
		{ id: '1', label: 'something', active: false },
		{ id: '2', label: 'something else', active: true },
		{ id: '3', label: 'sth else', active: false }
	];
	/*
  TODO:
  1. Make a wrapper for GridItems i.e. Tab Component
  2. Make a moveHandle
  3. Make a resizer
  */
</script>

<div class="flex h-full w-full">
	<Grid bounds cols={120} rows={60} itemSize={{ width: 16, height: 16 }}>
		{#each outer as item}
			<GridItem
				id={item.id}
				activeClass="opacity-0"
				class="bg-surface-200-700-token"
				bind:x={item.x}
				bind:y={item.y}
				bind:w={item.w}
				bind:h={item.h}
			>
				{#snippet gridItem()}
					<Tabs {entities}></Tabs>
				{/snippet}
			</GridItem>
		{/each}
	</Grid>
</div>
