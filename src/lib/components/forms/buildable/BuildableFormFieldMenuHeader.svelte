<script lang="ts">
	import { ArrowLeftIcon } from '@lucide/svelte';
	import { getBuildableFormFieldMenuState } from './buildableFormFieldMenuState.svelte';

	let fieldMenu = getBuildableFormFieldMenuState();
</script>

<div class="col-span-2 mb-2 flex w-full place-items-center justify-between">
	<span class="text-lg font-bold capitalize">{fieldMenu.state.label}</span>
	<button
		type="button"
		disabled={fieldMenu.state.tab === 'field-list'}
		onclick={() => fieldMenu.default()}
		class="group variant-ghost btn-icon btn-icon-sm rounded-token hover:variant-soft"
	>
		<ArrowLeftIcon class="transition-transform group-hover:-translate-x-1"></ArrowLeftIcon>
	</button>
</div>
