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
	let { focused, disabled, errors } = getField<string>();
	let store = getLookups();

	let timeout: ReturnType<typeof setTimeout>;

	function handleSearch() {
		store.searching = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(fetchLookups, 400);
	}
	async function fetchLookups() {
		store.lookups = await fetch(`${route(apiRoute)}?search=${store.inputValue}&lookups=true`).then(
			async (r) => (await r.json()) as Lookup[]
		);
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
	$inspect(store.searching);
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
