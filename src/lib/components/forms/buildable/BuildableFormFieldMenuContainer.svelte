<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	let { activeMenuTab, children }: { activeMenuTab: string; children: Snippet } = $props();
</script>

<div
	class="bg-surface-100-800-token border-surface-500-400-token h-full w-fit min-w-72 overflow-y-auto border-x border-t p-4"
>
	{#key activeMenuTab}
		<div in:fade={{ duration: 600 }} class="flex h-full w-full flex-col">
			{@render children()}
		</div>
	{/key}
</div>
