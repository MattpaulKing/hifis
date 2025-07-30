<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { FieldBtnProps } from './elementsDefault';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		btnData,
		children,
		...restProps
	}: { btnData: FieldBtnProps; children: Snippet } & HTMLButtonAttributes = $props();
</script>

<button
	draggable="true"
	class="variant-ghost border-surface-500-400-token btn z-30 h-min w-full max-w-36 border"
	{...restProps}
>
	<span class="rounded-token">
		{@render children()}
	</span>
	<span class="whitespace-break-spaces">{btnData.title}</span>
</button>
