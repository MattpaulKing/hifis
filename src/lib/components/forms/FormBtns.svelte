<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getFormCtx } from './inputs/context.svelte';
	let { btnLeft, btnRight }: { btnLeft?: Snippet; btnRight?: Snippet } = $props();
	let { disabled } = getFormCtx();
</script>

<div class="col-span-2 mt-6 flex justify-between">
	{#if btnLeft}
		{@render btnLeft()}
	{:else}
		<div></div>
	{/if}
	{#if btnRight}
		{@render btnRight()}
	{:else}
		<button disabled={$disabled} class="variant-filled-success btn"> Save </button>
	{/if}
</div>
