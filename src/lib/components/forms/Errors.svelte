<script lang="ts">
	import { fade } from 'svelte/transition';
	import { getField } from './inputs/context.svelte';

	let { errors } = getField();
</script>

<div class="relative z-10 w-full">
	{#if $errors}
		<div
			class="card border-error-500-400-token absolute flex flex-col items-center border p-1 rounded-token"
			transition:fade
		>
			<div
				id="arrow"
				class="bg-surface-100-800-token border-error-500-400-token absolute -mt-3 aspect-square w-4 rotate-45 border"
			></div>
			<span class="card z-10 -mt-1 inline-flex p-1">
				{$errors.join(', ')}
			</span>
		</div>
	{/if}
</div>
