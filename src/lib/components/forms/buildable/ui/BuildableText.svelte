<script lang="ts">
	import { getField, getFormCtx } from '../../inputs/context.svelte';
	let {
		i,
		class: classes,
		size,
		color,
		...restProps
	}: { i: number; class?: string; size: string; color: string } = $props();
	let { value, path, disabled, errors } = getField<string>();
</script>

<span class={size === 'lg' ? 'text-lg' : size === 'md' ? 'text-base' : 'text-sm'} title={$value}
	>{$value}</span
>
