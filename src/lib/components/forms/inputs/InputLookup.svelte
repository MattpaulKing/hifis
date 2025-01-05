<script lang="ts">
	import { getField } from './context.svelte';
	import { route, type KIT_ROUTES } from '$lib/ROUTES';
	import { getLookups } from '..';
	import type { Lookup } from '$lib/interfaces/Lookup';
	type Props = {
		apiRoute: keyof KIT_ROUTES['SERVERS'];
		restProps?: Record<keyof HTMLInputElement, string>;
	};
	let { apiRoute, ...restProps }: Props = $props();
	let { value, focused, disabled, errors } = getField<string | undefined>();
	let store = getLookups();

	let timeout: ReturnType<typeof setTimeout>;

	$inspect(store);

	function handleSearch() {
		store.searching = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(fetchLookups, 400);
	}
	async function fetchLookups() {
		let fetchedLookups = await fetch(
			`${route(apiRoute)}?search=${store.inputValue}&lookups=true`
		).then(async (r) => (await r.json()) as Lookup[]);

		if (Array.isArray($value) && $value.length > 0) {
			let selectedLookups = store.lookups.filter((lookup) => $value.includes(lookup?.id));
			fetchedLookups = fetchedLookups.filter((lookup) => !$value?.includes(lookup.id));
			store.lookups = [...selectedLookups, ...fetchedLookups];
		} else if (typeof $value === 'string' && $value.length > 0) {
			fetchedLookups = fetchedLookups.filter((lookup) => lookup.id !== $value);
			let selectedLookup = store.lookups.find((lookup) => lookup?.id === $value);
			store.lookups = [selectedLookup, ...fetchedLookups];
		}
		store.searching = false;
	}
	function onkeydown(e: KeyboardEvent) {
		$focused = true;
		if (e.key === 'Escape') {
			$focused = false;
			return;
		}
		handleSearch();
	}
</script>

<input
	type="search"
	autocomplete="off"
	class="input"
	disabled={$disabled}
	title={store.inputValue}
	bind:value={store.inputValue}
	aria-invalid={$errors ? 'true' : 'false'}
	{...restProps}
	{onkeydown}
/>
