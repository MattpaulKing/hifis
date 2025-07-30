<script lang="ts">
	import { getBuildableGridController } from '../BuildableGridController.svelte';
	import type { Infer, SuperForm } from 'sveltekit-superforms';
	import type { entitySchema } from '$src/schemas';
	import type { Snippet } from 'svelte';
	let {
		enhance,
		action,
		children
	}: {
		enhance: SuperForm<Infer<typeof entitySchema>>['enhance'];
		action: string;
		children: Snippet;
	} = $props();
	let controller = getBuildableGridController();
</script>

<form
	use:enhance
	method="POST"
	{action}
	class="relative h-full w-full"
	bind:this={controller.gridElement}
	ondragenter={(e) => {
		if (controller.tempField !== null) {
			controller.onNewFieldDragOver({ e });
		} else if (controller.tempBlock !== null) {
			controller.onNewBlockDragOver({ e });
		}
	}}
>
	{@render children()}
</form>
