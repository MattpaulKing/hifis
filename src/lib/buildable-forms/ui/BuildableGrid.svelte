<script lang="ts">
	import { getBuildableGridController } from '../BuildableGridController.svelte';
	import type { Infer, SuperForm } from 'sveltekit-superforms';
	import type { entitySchema } from '$src/schemas';
	import type { Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	let {
		enhance,
		action,
		children,
		...restProps
	}: {
		enhance: SuperForm<Infer<typeof entitySchema>>['enhance'];
		action: string;
		children: Snippet;
	} & HTMLFormAttributes = $props();
	let controller = getBuildableGridController();
</script>

<form
	use:enhance
	method="POST"
	{action}
	class="relative h-full w-full"
	bind:this={controller.gridElement}
	{...restProps}
>
	{@render children()}
</form>
