<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = { children: Snippet; disabled: boolean; onclick: (e: MouseEvent) => void };
	let { disabled, onclick, children }: Props = $props();
</script>

<button
	{disabled}
	{onclick}
	class="btn btn-sm grid w-full grid-cols-2 gap-x-2 gap-y-1 space-x-0 hover:variant-ghost disabled:cursor-not-allowed"
>
	{@render children()}
</button>
