<script lang="ts">
	import {
		buildableElements,
		BuildableBlockBtns,
		BuildableElementContainer,
		BuildableFieldBtns,
		BuildableFormButtonsMenu,
		BuildableFormButtonsMenuSection,
		BuildableGrid,
		BuildableFieldForm,
		type BuildableLayoutMetaData
	} from '$src/lib/buildable-forms';
	import { setBuildableGridController } from '$src/lib/buildable-forms/BuildableGridController.svelte.js';
	import { Field, initForm, Label } from '$src/lib/components/forms/index.js';
	import {
		entityBlocksSchema,
		entityBlockType,
		entityFieldsSchema,
		entityFieldType,
		entitySchema
	} from '$src/schemas/index.js';
	import { route } from '$src/lib/ROUTES';
	import { EntityForm } from '../../lib/index.js';

	let { data } = $props();

	let controller = setBuildableGridController({
		entityId: data.entityId,
		fields: data.entityForm.data.fields,
		blocks: data.entityForm.data.blocks,
		fieldMetaData: entityFieldType.enumValues.reduce(
			(agg, curr) => {
				agg[curr] = {
					min: { widthGridUnits: 5, heightGridUnits: 3 },
					moveable: true,
					resizeable: true,
					element: null,
					active: false
				};
				return agg;
			},
			{} as Record<(typeof entityFieldType.enumValues)[number], BuildableLayoutMetaData>
		),
		blockMetaData: entityBlockType.enumValues.reduce(
			(agg, curr) => {
				agg[curr] = {
					min: { widthGridUnits: 5, heightGridUnits: 3 },
					moveable: true,
					resizeable: true,
					element: null,
					active: false
				};
				return agg;
			},
			{} as Record<(typeof entityBlockType.enumValues)[number], BuildableLayoutMetaData>
		),
		gridSize: 50,
		view: 'xl'
	});

	let entityForm = initForm({
		form: data.entityForm,
		schema: entitySchema
	});
	let entityFieldForm = initForm({
		form: data.entityFieldForm,
		schema: entityFieldsSchema
	});
	let entityBlockSchema = initForm({
		form: data.entityBlockForm,
		schema: entityBlocksSchema
	});
	/*
    TODO:
    -1. Remove infinity values from defaults filter
    0. Add defaults for field types to DB and query them to add to the controller
    1. Add error handling for form finding idx
    2. Do the entity form
    3. Do the fields / blocks forms
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
			<BuildableFieldForm {entityFieldForm} />
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
		ondragenter={async (e) => await controller.onDragEnter({ e })}
	>
		{#if controller.gridElement}
			{#each controller.items.fields as _, i (i)}
				{@const Input =
					buildableElements.fields[controller.items.fields[i].fieldType].component.render}
				<BuildableElementContainer
					boundingElement={controller.gridElement}
					elementType="fields"
					idx={i}
				>
					<Field class="-mt-0" form={entityForm} path="description">
						<Label label={controller.items.fields[i].label} />
						<Input />
					</Field>
				</BuildableElementContainer>
			{/each}
			{#each controller.items.blocks as _, i (i)}
				{@const Block =
					buildableElements.blocks[controller.items.blocks[i].fieldType].component.render}
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
