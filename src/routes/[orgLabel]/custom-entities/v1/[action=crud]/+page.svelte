<script lang="ts">
	import {
		buildableElements,
		BuildableBlockBtns,
		BuildableElementContainer,
		BuildableFieldBtns,
		BuildableFormButtonsMenu,
		BuildableFormButtonsMenuSection,
		BuildableGrid,
		BuildableFieldForm
	} from '$src/lib/buildable-forms';
	import { setBuildableGridController } from '$src/lib/buildable-forms/BuildableGridController.svelte.js';
	import { Field, initForm, Label } from '$src/lib/components/forms/index.js';
	import { entityBlocksSchema, entityFieldsSchema, entitySchema } from '$src/schemas/index.js';
	import { route } from '$src/lib/ROUTES';
	import { EntityForm } from '../../lib/index.js';

	let { data } = $props();

	let controller = setBuildableGridController({
		entityId: data.entityId,
		fields: data.entityForm.data.fields,
		blocks: data.entityForm.data.blocks,
		fieldLayoutMetaData: data.entityFieldLayoutMetaData,
		blockLayoutMetaData: data.entityBlockLayoutMetaData,
		gridSize: 50,
		view: 'xl'
	});

	let entityForm = initForm({
		form: data.entityForm,
		schema: entitySchema
	});
	let entityFieldForm = initForm({
		form: data.entityFieldForm,
		schema: entityFieldsSchema,
		opts: {
			onUpdate({ form: { data: formData }, result: { type: resType } }) {
				if (resType === 'success') {
					let idx = controller.items.fields.findIndex(({ id }) => id === formData.id);
					let { layouts } = controller.items.fields[idx];
					controller.items.fields[idx] = {
						...formData,
						layouts
					};
				}
			}
		}
	});
	let entityBlockSchema = initForm({
		form: data.entityBlockForm,
		schema: entityBlocksSchema
	});
	/*
    TODO:
    1. Prompt with modal for deleting a field
  */
	$inspect(controller.items);
</script>

<div class="relative flex h-full w-full overflow-y-auto">
	<BuildableFormButtonsMenu
		rerenderKey={`${controller.menu.label} ${controller.menu.fieldId} ${controller.menu.blockId}`}
	>
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
			{#key controller.menu.fieldId}
				<BuildableFieldForm {entityFieldForm} />
			{/key}
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
						<Label class="" label={controller.items.fields[i].label} />
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
