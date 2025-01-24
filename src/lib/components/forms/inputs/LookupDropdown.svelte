<script lang="ts">
	import { getField } from './context.svelte';
	import { getLookups } from './LookupStore.svelte';
	import type { Lookup } from '$lib/interfaces/Lookup';

	let { value, path, focused, disabled } = getField<string | string[]>();
	let store = getLookups();

	function handleClick({ lookup }: { lookup: Lookup }) {
		if (Array.isArray($value)) {
			if ($value.includes(lookup.id)) {
				$value = $value.filter((id) => id !== lookup.id);
				store.inputValue = '';
			} else {
				$value.push(lookup.id);
				store.inputValue = '';
			}
		} else {
			if ($value === lookup.id) {
				$value = '';
				store.inputValue = '';
			} else {
				$value = lookup.id;
				store.inputValue = lookup.label;
			}
		}
	}
</script>

{#if !$disabled && $focused}
	<div
		role="combobox"
		aria-expanded={$focused}
		aria-controls={path}
		tabindex="0"
		class="relative z-20"
	>
		<div
			class="card border-surface-400-500-token absolute flex h-fit max-h-36 min-w-full flex-col space-y-1 overflow-y-auto border px-2 py-4"
		>
			{#if store.searching}
				{@render searchPlaceholder()}
				{@render searchPlaceholder()}
				{@render searchPlaceholder()}
			{:else if store.lookups.length > 0}
				{#each store.lookups.filter((lookup) => lookup !== undefined) as lookup}
					<button
						onclick={() => handleClick({ lookup })}
						type="button"
						class="{$value === lookup.id
							? 'variant-ghost'
							: ''} px-2 py-1 text-left rounded-token hover:variant-ghost">{lookup.label}</button
					>
				{/each}
			{:else}
				<span class="h-48">Nothing found ...</span>
			{/if}
		</div>
	</div>
{/if}

{#snippet searchPlaceholder()}
	<div class="placeholder h-8 w-full animate-pulse"></div>
{/snippet}
