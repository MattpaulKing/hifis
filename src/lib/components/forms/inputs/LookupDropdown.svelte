<script lang="ts">
	import { getField } from './context.svelte';
	import { getLookups } from './LookupStore.svelte';

	let { value, path, focused, disabled, errors } = getField<string>();
	let store = getLookups();
	$inspect(store.searching);
</script>

<div class="relative">
	{#if $focused}
		<div class="card absolute flex flex-col p-2">
			{#if store.searching}
				<div class="placeholder h-12 w-full animate-pulse"></div>
				<div class="placeholder h-12 w-full animate-pulse"></div>
				<div class="placeholder h-12 w-full animate-pulse"></div>
			{:else}
				{#each store.lookups as lookup}
					<div class="flex">{lookup.label}</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>
