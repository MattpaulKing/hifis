<script lang="ts">
	import type { Snippet } from 'svelte';
	let { class: classes = '', children }: { class?: string; children: Snippet } = $props();
</script>

<div class="col-span-2 flex w-full place-items-center justify-between">
	<h3 class="h3 {classes} font-bold">{@render children()}</h3>
</div>
