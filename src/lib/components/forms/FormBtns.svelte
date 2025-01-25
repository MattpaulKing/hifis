<script lang="ts">
	import type { Snippet } from 'svelte';
	let { btnLeft, btnRight }: { btnLeft?: Snippet; btnRight?: Snippet } = $props();
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
		<button class="variant-filled-success btn"> Save </button>
	{/if}
</div>
