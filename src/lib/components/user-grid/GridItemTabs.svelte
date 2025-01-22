<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutItemEntity } from './types';
	type Props = {
		entities: LayoutItemEntity[];
		onclick?: (t: LayoutItemEntity) => void;
		onAdd?: () => void;
		children: Snippet;
	};
	let { entities, onclick, onAdd, children }: Props = $props();

	function onkeydown(e: KeyboardEvent, t: LayoutItemEntity) {
		if (e.key === 'Tab' || e.key === 'Escape') return;
		onclick?.(t);
	}
</script>

{#snippet tab(t: LayoutItemEntity)}
	<div
		role="tab"
		tabindex="0"
		onclick={() => onclick?.(t)}
		onkeydown={(e) => onkeydown(e, t)}
		title={t.label}
		class="{t.active
			? 'variant-filled rounded-tl-token rounded-tr-token'
			: 'rounded-token hover:bg-surface-400-500-token'} relative flex min-w-16 place-items-center justify-between px-3 py-1"
	>
		<span class="truncate">{t.label}</span>
		<div class="ml-4">
			<button
				class="btn-icon btn-icon-sm absolute right-0.5 top-0 my-0 h-5 w-5 font-bold hover:variant-filled {t.active
					? 'hover:invert'
					: ''}"
			>
				<span class="">x</span>
			</button>
		</div>
	</div>
{/snippet}

<div
	class="border-surface-500-400-token flex w-full place-items-center justify-between border-b px-1 pb-1 pt-1 rounded-tl-token rounded-tr-token"
>
	<div class="flex place-items-center gap-x-2">
		{#each entities as entity}
			{@render tab(entity)}
		{/each}
		<span class="divider-vertical border-surface-500-400-token mr-0 h-4 w-1"></span>
		<div class="flex place-items-center justify-end">
			<button onclick={onAdd} class="btn-icon btn-icon-sm h-5 w-5 font-bold hover:variant-filled"
				>+</button
			>
		</div>
	</div>

	{@render children()}
</div>
