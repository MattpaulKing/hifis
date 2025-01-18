<script lang="ts">
	type TabEntity = { id: string; label: string; active: boolean };
	type Props = { entities: TabEntity[]; onclick?: (t: TabEntity) => void; onAdd?: () => void };
	let { entities, onclick, onAdd }: Props = $props();

	function onkeydown(e: KeyboardEvent, t: TabEntity) {
		if (e.key === 'Tab' || e.key === 'Escape') return;
		onclick?.(t);
	}
</script>

<div
	class="border-surface-500-400-token flex place-items-center border-b px-1 pb-1 pt-1 rounded-tl-token rounded-tr-token"
>
	<div class="flex gap-x-2">
		{#each entities as entity}
			{@render tab(entity)}
		{/each}
	</div>
	<span class="divider-vertical border-surface-500-400-token ml-2 mr-0 h-4 w-1"></span>
	<div class="flex place-items-center justify-end px-2">
		<button onclick={onAdd} class="btn-icon btn-icon-sm h-5 w-5 font-bold hover:variant-filled"
			>+</button
		>
	</div>
</div>

{#snippet tab(t: TabEntity)}
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
