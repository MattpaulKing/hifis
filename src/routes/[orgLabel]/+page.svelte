<script lang="ts">
	import { Grid, GridItem } from '$lib/components/user-grid';

	let { data } = $props();

	let items = $state(data.usersComponents);
</script>

<Grid bounds cols={0} rows={0} gap={32} itemSize={{ width: 32, height: 32 }}>
	{#each items as _, i}
		<GridItem class="card rounded-token" item={items[i]} entities={data.entities}>
			{#snippet gridItem(entity)}
				<div>{entity.label}</div>
			{/snippet}
		</GridItem>
	{/each}
</Grid>
