<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	let {
		drawerOpen,
		children,
		stepper
	}: {
		drawerOpen?: boolean;
		stepper?: Snippet;
		children: Snippet;
	} = $props();
</script>

{#if drawerOpen}
	<div
		in:fade
		class="card border-surface-200-700-token relative flex h-full w-full flex-wrap border md:flex-nowrap"
	>
		{@render stepper?.()}
		<div class="flex flex-col">
			{@render children()}
		</div>
	</div>
{:else}
	<div
		in:fade
		class="card border-surface-200-700-token relative flex h-min w-fit flex-wrap border shadow-lg shadow-surface-500 md:flex-nowrap"
	>
		{@render stepper?.()}
		<div class="flex flex-col">
			{@render children()}
		</div>
	</div>
{/if}
