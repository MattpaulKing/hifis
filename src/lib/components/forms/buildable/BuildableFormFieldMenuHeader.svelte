<script lang="ts">
	import { ArrowLeftIcon, SaveIcon } from '@lucide/svelte';
	import { getBuildableFormFieldMenuState } from './buildableFormFieldMenuState.svelte';

	let { onSave }: { onSave?: () => Promise<void> } = $props();

	let fieldMenu = getBuildableFormFieldMenuState();
</script>

<div class="col-span-2 mb-4 flex w-full place-items-center justify-between">
	<span class="text-lg font-bold capitalize">{fieldMenu.state.label}</span>
	{#if fieldMenu.state.tab === 'field-list'}
		<button
			onclick={async () => await onSave?.()}
			class="variant-filled-success btn-icon btn-icon-sm rounded-token"
		>
			<SaveIcon />
		</button>
	{:else}
		<button
			type="button"
			onclick={() => fieldMenu.default()}
			class="group variant-ghost btn-icon btn-icon-sm rounded-token hover:variant-soft"
		>
			<ArrowLeftIcon class="transition-transform group-hover:-translate-x-1"></ArrowLeftIcon>
		</button>
	{/if}
</div>
