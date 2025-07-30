<script lang="ts">
	import { BuildableElementButton, buildableElements, getBuildableGridController } from '..';
	let controller = getBuildableGridController();
</script>

{#each Object.values(buildableElements['fields']) as fieldInputDefault}
	{@const Icon = fieldInputDefault.component.icon}
	<BuildableElementButton
		btnData={fieldInputDefault.component}
		ondragstart={(e) => controller.onNewFieldDragStart({ e, field: fieldInputDefault })}
		ondrag={(e) => controller.onNewFieldDrag({ e })}
		ondragend={(e) => controller.onNewDragEnd({ e })}
	>
		<Icon size={20} />
	</BuildableElementButton>
{/each}
