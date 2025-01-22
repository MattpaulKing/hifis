<script lang="ts">
	import { Debouncer } from '$lib/api';
	import { saveUserGrid, Grid, GridItem } from '$lib/components/user-grid';

	let items = $state([
		{
			id: '1',
			label: 'A',
			x: 0,
			y: 0,
			h: 4,
			w: 10,
			min: { h: 1, w: 2 },
			moveable: false,
			resizeable: true
		},
		{
			id: '2',
			label: 'B',
			x: 10,
			y: 0,
			h: 4,
			w: 10,
			min: { h: 1, w: 2 },
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

<div class="flex h-full w-full p-4">
	<Grid
		bounds
		cols={{
			xs: 1,
			sm: 1,
			md: 2,
			lg: 3,
			xl: 3,
			xxl: 3
		}}
		rows={0}
		gap={32}
		itemSize={{ width: 32, height: 32 }}
	>
		{#each items as item, i}
			<GridItem class="card rounded-token" bind:item={items[i]} bind:entities>
				{#snippet gridItem(entity)}
					<div>{entity.label}</div>
				{/snippet}
			</GridItem>
		{/each}
	</Grid>
</div>
