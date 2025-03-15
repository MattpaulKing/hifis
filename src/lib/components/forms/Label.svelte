<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getField } from './inputs/context.svelte';
	let {
		label,
		class: classes = '',
		children,
		fieldDescription
	}: {
		label: string | undefined;
		class?: string;
		children?: Snippet;
		fieldDescription?: Snippet;
	} = $props();
	let { path } = getField();
</script>

<label for={path} class="mb-1 ml-1 flex flex-col">
	<div class="flex h-8 w-full place-items-center justify-between gap-x-2">
		<span class={classes}>
			{label}
		</span>
		{#if children}
			{@render children()}
		{/if}
	</div>
	{#if fieldDescription}
		{@render fieldDescription()}
	{/if}
</label>
