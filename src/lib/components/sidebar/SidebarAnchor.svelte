<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	let {
		href,
		active: _active,
		children
	}: { href: string; active?: boolean; children: Snippet } = $props();
	let active = $derived(page.url.pathname === href);
</script>

<a
	{href}
	class="btn btn-sm ml-0 flex flex-col items-center
    font-bold transition-colors
    [&>span]:relative [&>span]:-left-1 [&>span]:text-sm {active
		? 'variant-filled'
		: 'hover:variant-ghost [&>img]:dark:invert'}"
>
	{@render children()}
</a>
