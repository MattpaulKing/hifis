<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	let { rerenderKey, children }: { rerenderKey?: string; children: Snippet } = $props();
</script>

{#key rerenderKey}
	<div
		class="bg-surface-100-800-token border-surface-500-400-token h-full w-fit min-w-72 overflow-y-auto border-x border-t"
	>
		<div in:fade={{ duration: 800 }} class="flex h-full w-full flex-col p-4 transition-all">
			{@render children()}
		</div>
	</div>
{/key}
