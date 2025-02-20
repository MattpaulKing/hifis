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
				$value = $value;
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
			class="card border-surface-400-500-token absolute flex h-fit max-h-36 min-w-full flex-col space-y-0.5 overflow-y-auto border py-4 pl-4 pr-2"
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
						class="{$value === lookup.id || $value.includes(lookup.id)
							? 'variant-ghost'
							: ''} flex flex-col px-2 py-2 text-left rounded-token hover:variant-ghost"
					>
						<span class="truncate {lookup.description ? 'font-bold' : ''}">{lookup.label}</span>
						<span class={lookup.description ? 'block' : 'hidden'}>{lookup.description}</span>
						<span class={lookup.descriptionExtra ? 'block' : 'hidden'}
							>{lookup.descriptionExtra}</span
						>
					</button>
				{/each}
			{:else}
				<span class="h-28">Nothing found ...</span>
			{/if}
		</div>
	</div>
{/if}

{#snippet searchPlaceholder()}
	<div class="placeholder h-8 w-full animate-pulse"></div>
{/snippet}
