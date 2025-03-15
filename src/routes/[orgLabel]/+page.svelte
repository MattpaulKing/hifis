<script lang="ts">
	import { Grid, GridItem } from '$lib/components/user-grid';

	let { data } = $props();

	let items = $state(data.usersComponents);
	/*
  TODO: 
    Components Buttons then add to the items with a default field component
    Open a sidebar with a form for the field component settings
  */
</script>

<div class="flex h-full w-full flex-col p-6">
	<div class="flex h-fit w-full justify-between">
		<input class="input w-24" value="" />
		<div class="flex gap-x-2">
			<button class="variant-ghost btn">Input</button>
		</div>
	</div>
	<Grid class="border" bounds gap={32} itemSize={{ width: 32, height: 32 }}>
		{#each items as _, i}
			<GridItem class="card rounded-token" item={items[i]} entities={data.entities}>
				{#snippet gridItem(entity)}
					<div>{entity.label}</div>
				{/snippet}
			</GridItem>
		{/each}
	</Grid>
</div>
