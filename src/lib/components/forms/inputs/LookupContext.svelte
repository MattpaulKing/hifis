<script lang="ts">
	import { getField } from './context.svelte';
	import { setLookups } from '..';
	import type { Lookup } from '$lib/interfaces/Lookup';
	import type { Snippet } from 'svelte';

	type Props = {
		inputValue: string;
		lookups?: Lookup[];
		children: Snippet;
	};
	let { inputValue, lookups, children }: Props = $props();
	let { value } = getField<string | string[]>();

	setLookups({ lookups, value, inputValue });
</script>

{@render children()}
