<script lang="ts">
	import { Debouncer } from '$lib/api';
	import { saveUserGrid, Grid, GridItem } from '$lib/components/user-grid';
	import { innerWidth } from 'svelte/reactivity/window';

	let items = $state([
		{
			id: '1',
			label: 'A',
			x: 0,
			y: 0,
			h: 10,
			w: 20,
			min: { h: 10, w: 20 },
			moveable: true,
			resizeable: true
		},
		{
			id: '2',
			label: 'B',
			x: 20,
			y: 0,
			h: 10,
			w: 20,
			min: { h: 10, w: 20 },
			moveable: true,
			resizeable: true
		}
	]);
	let debouncer = new Debouncer({
		callback: async () => {
			await saveUserGrid(items);
			return;
		}
	});
	let entities = $state([
		{ id: '1', label: 'something', active: false },
		{ id: '2', label: 'something else', active: true },
		{ id: '3', label: 'sth else', active: false }
	]);
</script>

<div class="flex h-full w-full">
	<Grid cols={120} rows={0} itemSize={{ width: 32, height: 32 }} collision="none">
		{#each items as item, i}
			<GridItem class="card rounded-token" bind:item={items[i]} bind:entities>
				{#snippet gridItem(entity)}
					<div>{entity.label}</div>
				{/snippet}
			</GridItem>
		{/each}
	</Grid>
</div>
