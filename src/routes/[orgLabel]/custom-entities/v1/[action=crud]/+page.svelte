<script lang="ts">
	import {
		BuildableBlockBtns,
		BuildableElementContainer,
		buildableElements,
		BuildableFieldBtns,
		BuildableFormButtonsMenu,
		BuildableFormButtonsMenuSection,
		BuildableGrid
	} from '$src/lib/buildable-forms';
	import { setBuildableGridController } from '$src/lib/buildable-forms/BuildableGridController.svelte.js';
	import { Field, initForm, Label } from '$src/lib/components/forms/index.js';
	import { entitySchema } from '$src/schemas/index.js';
	import { route } from '$src/lib/ROUTES';
	import { EntityForm } from '../../lib/index.js';

	let { data } = $props();

	let controller = setBuildableGridController({
		entityId: data.entityId,
		buildableFields: [],
		buildableBlocks: [],
		gridSize: 50
	});

	let entityForm = initForm({
		form: data.entityForm,
		schema: entitySchema
	});
	/*
    TODO:
    1. Have to do resize logic
    2. Do the Blocks Elements
    3. Do the entity form
  */
</script>

<div class="relative flex h-full w-full overflow-y-auto">
	<BuildableFormButtonsMenu>
		{#if controller.menu.showing === 'form-entity-properties'}
			<EntityForm
				form={entityForm}
				action={route('updateEntity /[orgLabel]/custom-entities/v1/[action=crud]', {
					orgLabel: data.org.label,
					action: 'update'
				})}
			/>
		{:else if controller.menu.showing === 'form-elements-list'}
			<BuildableFormButtonsMenuSection label="Field Inputs"></BuildableFormButtonsMenuSection>
			<BuildableFieldBtns></BuildableFieldBtns>
			<div class="col-span-2 h-4 w-full"></div>
			<BuildableFormButtonsMenuSection label="Blocks"></BuildableFormButtonsMenuSection>
			<BuildableBlockBtns></BuildableBlockBtns>
		{:else if controller.menu.showing === 'form-field-properties'}
			<div class="col-span-2 h-48 w-48 bg-red-500"></div>
		{:else if controller.menu.showing === 'form-block-properties'}
			<div class="col-span-2 h-48 w-48 bg-blue-500"></div>
		{/if}
	</BuildableFormButtonsMenu>
	<BuildableGrid
		enhance={entityForm.enhance}
		action={route('default /[orgLabel]/custom-entities/[action=crud]', {
			orgLabel: data.org.label,
			action: 'update'
		})}
	>
		{#if controller.gridElement}
			{#each controller.items.fields as _, i}
				{@const Input =
					buildableElements.fields[controller.items.fields[i].properties.fieldType].component
						.render}
				<BuildableElementContainer
					boundingElement={controller.gridElement}
					elementType="fields"
					idx={i}
				>
					<Field class="-mt-0" form={entityForm} path="description">
						<Label label={controller.items.fields[i].properties.label} />
						<Input />
					</Field>
				</BuildableElementContainer>
			{/each}
			{#each controller.items.blocks as _, i}
				{@const Block =
					buildableElements.blocks[controller.items.blocks[i].properties.fieldType].component
						.render}
				<BuildableElementContainer
					boundingElement={controller.gridElement}
					elementType="blocks"
					idx={i}
				>
					<Field class="-mt-0" form={entityForm} path="description">
						<Block />
					</Field>
				</BuildableElementContainer>
			{/each}
		{/if}
	</BuildableGrid>
</div>
