<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TabEntity } from './GridItemTabsState.svelte';
	import type { GridItemTabsState } from '.';
	import { fade } from 'svelte/transition';
	type Props = {
		tabState: GridItemTabsState;
		tabRef?: HTMLDivElement;
		onclick?: (t: TabEntity) => void;
		onAdd?: () => void;
		onpointerdown?: ((e: PointerEvent) => void) | null;
		onpointerup?: (e: PointerEvent) => void;
		children?: Snippet;
	};
	let {
		tabState,
		tabRef = $bindable(),
		onpointerup,
		onpointerdown,
		onclick,
		onAdd,
		children
	}: Props = $props();

	function onkeydown(e: KeyboardEvent, t: TabEntity) {
		if (e.key !== 'Enter' && e.key !== 'Space') return;
		onclick?.(t);
	}
</script>

<div
	bind:this={tabRef}
	{onpointerdown}
	{onpointerup}
	class="border-surface-500-400-token flex w-full place-items-center justify-between border-b px-1 pb-1 pt-1 rounded-tl-token rounded-tr-token"
>
	<div class="flex place-items-center gap-x-2">
		{#each tabState.entities as entity, i}
			{@render tab({ entity, i })}
		{/each}
		<span class="divider-vertical border-surface-500-400-token mr-0 h-4 w-1"></span>
		<div class="flex place-items-center justify-end">
			<button
				onclick={() => {
					tabState.pushNew();
					onAdd?.();
				}}
				class="btn-icon btn-icon-sm h-5 w-5 font-bold hover:variant-filled">+</button
			>
		</div>
	</div>
	{@render children?.()}
</div>

{#snippet tab({ entity, i }: { entity: TabEntity; i: number })}
	<div
		transition:fade
		role="tab"
		tabindex="0"
		onclick={(e) => {
			e.stopImmediatePropagation();
			tabState.setActive(i);
			onclick?.(entity);
		}}
		onkeydown={(e) => onkeydown(e, entity)}
		title={entity.label}
		class="{entity.active
			? 'variant-filled rounded-tl-token rounded-tr-token'
			: 'rounded-token hover:bg-surface-400-500-token'} relative flex min-w-16 place-items-center justify-between px-3 py-1"
	>
		<span class="truncate">{entity.label}</span>
		<div class="ml-4">
			<button
				disabled={tabState.entities.length === 1 && entity.tabType === 'new-entity'}
				onclick={(e) => {
					e.stopPropagation();
					if (tabState.entities.length === 1 && entity.tabType === 'new-entity') return;
					tabState.remove({ entity });
				}}
				class="btn-icon btn-icon-sm absolute right-0.5 top-0 my-0 h-5 w-5 font-bold hover:variant-filled {entity.active
					? 'hover:invert'
					: ''}"
			>
				<span class="">x</span>
			</button>
		</div>
	</div>
{/snippet}
