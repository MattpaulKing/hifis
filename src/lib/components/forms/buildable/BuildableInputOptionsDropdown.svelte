<script lang="ts">
	import { flip } from 'svelte/animate';
	import { getField } from '../inputs/context.svelte';
	import { getLookups } from '../inputs/LookupStore.svelte';
	import { fly, slide } from 'svelte/transition';
	import type { Lookup } from '$lib/interfaces/Lookup';

	let { value, path, focused, disabled } = getField<Lookup[]>();
	let store = getLookups();

	function handleClick({ lookup }: { lookup: Lookup }) {
		if ($value.some(({ id }) => id === lookup.id)) {
			$value = $value.filter(({ id }) => id !== lookup.id);
			store.inputValue = '';
		} else {
			$value.push(lookup);
			$value = $value;
			store.inputValue = '';
		}
	}
	let dropdownRect = $state<DOMRectReadOnly>();
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
			transition:slide
			class="card border-surface-400-500-token absolute flex h-36 min-w-full flex-col space-y-1 overflow-y-auto overflow-x-hidden border py-4 pl-4 pr-2"
			bind:contentRect={dropdownRect}
		>
			{#if store.searching}
				{@render searchPlaceholder()}
				{@render searchPlaceholder()}
				{@render searchPlaceholder()}
			{:else if store.lookups.length > 0}
				{#each $value as lookup, i (i)}
					<button
						animate:flip
						transition:fly={{ x: dropdownRect.x, y: dropdownRect.y }}
						onclick={() => handleClick({ lookup })}
						type="button"
						class="variant-ghost flex flex-col px-2 py-2 text-left rounded-token"
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
