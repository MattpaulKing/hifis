<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getField } from './inputs/context.svelte';
	let {
		label,
		class: classes = '',
		children
	}: { label: string | undefined; class?: string; children?: Snippet } = $props();
	let { path, constraints } = getField();
</script>

<label for={path}>
	<div class="mb-1 ml-1 flex h-8 w-full place-items-center justify-between gap-x-2">
		<span class="{classes} {$constraints?.required ? 'field-required-label relative' : ''}">
			{label}
		</span>
		{#if children}
			{@render children()}
		{/if}
	</div>
</label>
