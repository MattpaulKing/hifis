<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { slide } from 'svelte/transition';
	import { SearchList, SearchListItem } from '.';
	import { Debouncer } from '$lib/api';
	import type { ResponseJSON, SearchData } from '$api/search/+server';

	async function fetchItems() {
		let resp = await fetch(route('GET /api/v1/search', { value })).then(
			async (r) => (await r.json()) as ResponseJSON
		);
		if (resp.type === 'error') return;
		searchedItems = resp.data ?? [];
	}
	function onWindowClick(e: Event & { target: any }) {
		if (searchMenuOpen && searchContainer && searchContainer.contains(e.target) === false) {
			searchMenuOpen = false;
			value = '';
		}
	}
	function handleKeydown() {
		searchMenuOpen = true;
		debouncer.search();
	}

	type Props = {};
	let {}: Props = $props();
	let value = $state('');
	let searchedItems = $state<SearchData[]>([]);
	let searchMenuOpen = $state(false);
	let searchContainer = $state<HTMLDivElement | undefined>();
	let debouncer = new Debouncer({ callback: fetchItems, ms: 400 });
</script>

<svelte:window onclick={onWindowClick} />
<div class="flex flex-col">
	<div
		bind:this={searchContainer}
		class="input-group input-group-divider grid-cols-[auto_auto_1fr] [&>div]:px-3"
	>
		<input bind:value onkeydown={handleKeydown} class="w-64" type="text" placeholder="Search..." />
		<div class="input-group-shim">
			<img src="/MagnifyingGlass.png" class="w-5 dark:invert" alt="magnifying-glass" />
		</div>
	</div>
	{#if searchMenuOpen}
		<div class="relative z-50 h-full w-full">
			<div transition:slide={{ duration: 400 }} class="absolute top-0 w-full overflow-x-hidden">
				<SearchList>
					{#if debouncer.searching}
						<div class="placeholder h-12 w-full animate-pulse"></div>
					{:else if searchedItems.length > 0}
						{#each searchedItems as item}
							<SearchListItem>
								<span>{item.label}</span>
							</SearchListItem>
						{/each}
					{:else}
						<span>Nothing found...</span>
					{/if}
				</SearchList>
			</div>
		</div>
	{/if}
</div>
