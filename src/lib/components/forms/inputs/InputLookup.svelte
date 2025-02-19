<script lang="ts">
	import { getField } from './context.svelte';
	import { getLookups } from './LookupStore.svelte';
	import type { Lookup } from '$lib/interfaces/Lookup';
	type Props = {
		apiRoute: string;
		onkeydown?: (e: KeyboardEvent) => void;
		restProps?: Record<keyof HTMLInputElement, string>;
	};
	let { apiRoute: _apiRoute, onkeydown: _onkeydown, ...restProps }: Props = $props();
	let { value, focused, disabled, errors, isArray, path } = getField<
		string | string[] | undefined
	>();
	let store = getLookups();
	let timeout: ReturnType<typeof setTimeout>;
	let apiRoute = $state(_apiRoute);

	function handleSearch(e: Event) {
		e.stopImmediatePropagation();
		$focused = true;
		store.searching = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(fetchLookups, 400);
	}
	async function fetchLookups() {
		if (_apiRoute.includes('?')) {
			apiRoute = _apiRoute.concat(`&search=${store.inputValue}&looukps=true`);
		} else {
			apiRoute = _apiRoute.concat(`?search=${store.inputValue}&looukps=true`);
		}
		console.log(apiRoute);
		let fetchedLookups = await fetch(apiRoute).then(async (r) => (await r.json()) as Lookup[]);
		store.filterFetchedLookups({ fetchedLookups, $value });
		store.searching = false;
	}
	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			$focused = false;
			return;
		}
		_onkeydown?.(e);
		handleSearch(e);
	}
</script>

<div
	role="combobox"
	aria-controls={path}
	tabindex="0"
	aria-expanded={$focused}
	class="input-group overflow-hidden [&>div]:px-2
  {$disabled ? 'border-none' : ''}
  {isArray ? 'grid-cols-[auto_1fr_auto]' : 'grid-cols-[1fr_auto]'}"
	onfocus={handleSearch}
	onclick={handleSearch}
	{onkeydown}
>
	{#if isArray && $value}
		<div
			title={store.lookups.map(({ label }) => label).join(', ')}
			class="pointer-events-none relative z-10 flex h-full w-min items-center justify-center"
		>
			<span
				class="relative -left-0.5 z-10 h-3/4 w-7 border border-gray-600 bg-surface-800 px-2 py-1 rounded-token {$value.length >
				0
					? 'block'
					: 'hidden'}">{$value.length}</span
			>
			{#each store.selectedLookups({ $value }) as _, i}
				{#if i > 0}
					<span
						style={`left: ${i + 1}px; top: ${i - 1}px;`}
						class="absolute h-7 w-7 border border-gray-600 bg-surface-800 px-2 py-1 rounded-token"
					></span>
				{/if}
			{/each}
		</div>
	{/if}
	<input
		id={path}
		type="text"
		autocomplete="off"
		class="w-full"
		readonly={$disabled}
		title={store.inputValue}
		bind:value={store.inputValue}
		aria-invalid={$errors ? 'true' : 'false'}
		{...restProps}
	/>
	<div class="input-group-shim pointer-events-none select-none">
		<img src="/MagnifyingGlass.png" class="w-5 dark:invert" alt="magnifying-glass" />
	</div>
</div>
