<script lang="ts">
	import { getField } from './context.svelte';
	import { getLookups } from './LookupStore.svelte';
	import type { Lookup } from '$lib/interfaces/Lookup';
	type Props = {
		apiRoute: string;
		onKeydown?: (e: KeyboardEvent) => void;
		restProps?: Record<keyof HTMLInputElement, string>;
	};
	let { apiRoute, onKeydown, ...restProps }: Props = $props();
	let { value, focused, disabled, errors } = getField<string | undefined>();
	let store = getLookups();

	let timeout: ReturnType<typeof setTimeout>;

	function handleSearch() {
		$focused = true;
		store.searching = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(fetchLookups, 400);
	}
	async function fetchLookups() {
		let fetchedLookups = await fetch(`${apiRoute}?search=${store.inputValue}&lookups=true`).then(
			async (r) => (await r.json()) as Lookup[]
		);
    store.filterFetchedLookups({ fetchedLookups, $value })
		store.searching = false;
	}
	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' || (e.key === 'Tab' && store.lookups.length === 0)) {
			$focused = false;
			return;
		}
		onKeydown?.(e);
		handleSearch();
	}
</script>

<div
	class="input-group {$disabled
		? 'border-none'
		: ''} input-group-divider grid-cols-[auto_auto_1fr] [&>div]:px-3"
>
	<input
		type="text"
		autocomplete="off"
		class="input"
		readonly={$disabled}
		title={store.inputValue}
		bind:value={store.inputValue}
		aria-invalid={$errors ? 'true' : 'false'}
		{...restProps}
		onfocus={handleSearch}
		{onkeydown}
	/>
	<div class="input-group-shim pointer-events-none select-none">
		<img src="/MagnifyingGlass.png" class="w-5 dark:invert" alt="magnifying-glass" />
	</div>
</div>
