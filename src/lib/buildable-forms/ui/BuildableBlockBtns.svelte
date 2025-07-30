<script lang="ts">
	import { BuildableElementButton, buildableElements } from '..';
	import { getBuildableGridController } from '../BuildableGridController.svelte';

	let controller = getBuildableGridController();
</script>

{#each Object.values(buildableElements['blocks']) as blockDefault}
	{@const Icon = blockDefault.component.icon}
	<BuildableElementButton
		btnData={blockDefault.component}
		ondragstart={(e) => controller.onNewBlockDragStart({ e, block: blockDefault })}
		ondrag={(e) => controller.onNewBlockDrag({ e })}
		ondragend={(e) => controller.onNewDragEnd({ e })}
	>
		<Icon size={20} />
	</BuildableElementButton>
{/each}
