<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		class: classes = '',
		children,
		btns
	}: { class?: string; children: Snippet; btns?: Snippet } = $props();
</script>

<div class="col-span-2 flex w-full place-items-center justify-between">
	<h3 class="h3 {classes} font-bold">{@render children()}</h3>
	{@render btns?.()}
</div>
