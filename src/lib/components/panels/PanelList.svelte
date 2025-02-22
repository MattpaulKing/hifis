<script lang="ts" generics="T extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	let { listItems, listItem }: { listItems: T[]; listItem: Snippet<[{ item: T }]> } = $props();
</script>

<div in:fade={{ duration: 700 }} class="flex w-full flex-col gap-x-4 bg-inherit p-4">
	<ul class="space-y-2 overflow-y-auto">
		{#each listItems as item}
			<li class="">
				{@render listItem({ item })}
			</li>
		{/each}
		{#if Object.values(listItems).length === 0}
			<li>
				<span class="mx-4">None found...</span>
			</li>
		{/if}
	</ul>
</div>
