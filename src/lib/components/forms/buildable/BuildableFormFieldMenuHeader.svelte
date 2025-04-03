<script lang="ts">
	import { ArrowLeftIcon } from '@lucide/svelte';
	import { getBuildableFormFieldMenuState } from './buildableFormFieldMenuState.svelte';

	let fieldMenu = getBuildableFormFieldMenuState();
</script>

<div class="col-span-2 flex w-full justify-between">
	<span class="text-lg font-bold capitalize">{fieldMenu.state.label}</span>
	<button
		onclick={() => fieldMenu.default()}
		disabled={fieldMenu.state.tab === 'field-list'}
		class="group variant-ghost btn-icon btn-icon-sm rounded-token hover:variant-soft"
	>
		<ArrowLeftIcon
			class="transition-transform {fieldMenu.state.tab !== 'field-list'
				? 'group-hover:-translate-x-1'
				: ''}"
		></ArrowLeftIcon>
	</button>
</div>
