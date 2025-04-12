<script lang="ts">
	import { Grid, setGridContext } from '$lib/components/user-grid';
	import {
		BuildableFieldContainer,
		BuildableFormFieldButtons,
		BuildableFormFieldForm,
		BuildableFormFieldMenuHeader,
		Field,
		initForm,
		Label,
		setBuildableFormFieldMenuState,
		updateEntityFields,
		type BuildableField,
		type BuildableFieldPreview,
		BuildableFormHeader,
		Input,
		FormContainer,
		BuildableFormFieldMenuContainer
	} from '$src/lib/components/forms';
	import fields from '$src/lib/components/forms/buildable/fields.js';
	import { route } from '$src/lib/ROUTES';
	import { entityFieldSchema, entitySchema } from '$src/schemas/index.js';

	let { data } = $props();
	let entityForm = initForm({
		form: data.entityForm,
		schema: entitySchema
	});
	let { form: entityFormData } = entityForm;

	let entityFieldsForm = initForm({
		form: data.entityFieldsForm,
		schema: entityFieldSchema,
		opts: {
			SPA: true,
			onUpdate({ cancel, form }) {
				cancel();
				if (!fieldMenuState.state.field?.layout) return;
				$entityFormData = updateEntityFields({
					$entityFormData,
					entityFieldsFormData: form.data,
					fieldMenuState
				});
				fieldMenuState.default();
			}
		}
	});

	let { form: entityFieldsFormData } = entityFieldsForm;
	let gridSettings = setGridContext({ cellSize: 16, bounds: true });
	let draggedField = $state<BuildableFieldPreview | null>(null);
	let isDragging = $derived(Boolean(draggedField));
	let fieldMenuState = setBuildableFormFieldMenuState();
	let dragEvent = $state<DragEvent | null>(null);

	function ondragend(field: BuildableFieldPreview) {
		let newField = {
			properties: { ...field.properties, entityId: $entityFormData.id ?? '' },
			layout: field.layout
		};
		$entityFormData.fields = [...$entityFormData.fields, newField];
		setActiveField(newField);
	}
	function setActiveField(item: BuildableField) {
		fieldMenuState.state = {
			field: item,
			tab: 'properties',
			label: `${item.properties.fieldType} Settings`
		};
		$entityFieldsFormData = { ...$entityFieldsFormData, ...item.properties };
	}
	function updateFieldLayout(updatedLayout: BuildableField['layout']) {
		let idx = $entityFormData.fields.findIndex(({ layout: { id } }) => id === updatedLayout.id);
		if (idx < 0) return;
		$entityFormData.fields[idx].layout = updatedLayout;
	}
	/*TODO:
    put default fields into a table
    backend functions
  */
	function deleteField(layoutItem: BuildableField['layout']) {
		$entityFormData.fields = $entityFormData.fields.filter(
			({ layout: { id } }) => id !== layoutItem.id
		);
		if (fieldMenuState.state.field?.layout.id === layoutItem.id) {
			fieldMenuState.default();
		}
	}
	$inspect($entityFormData.fields);
</script>

<div class="flex h-full w-full">
	<BuildableFormFieldMenuContainer rerenderKey={fieldMenuState.state.field?.properties.id}>
		<BuildableFormFieldMenuHeader></BuildableFormFieldMenuHeader>
		{#if fieldMenuState.state.tab === 'field-list'}
			<BuildableFormFieldButtons
				bind:draggedField
				bind:dragEvent
				entityFormId={data.entityFormId}
				{gridSettings}
				{ondragend}
			></BuildableFormFieldButtons>
		{:else if fieldMenuState.state.tab === 'properties'}
			{#if fieldMenuState.state.field.properties.fieldType === 'input'}
				<BuildableFormFieldForm {entityFieldsForm}></BuildableFormFieldForm>
			{:else if fieldMenuState.state.field.properties.fieldType === 'lookup'}
				<div></div>
			{/if}
		{/if}
	</BuildableFormFieldMenuContainer>
	<FormContainer
		class="w-full px-6 pb-6"
		form={entityForm}
		action={route('default /[orgLabel]', { orgLabel: data.org.label })}
		hasFormEl={false}
	>
		<BuildableFormHeader
			onPublishClick={async () => {
				$entityFormData.published = !$entityFormData.published;
			}}
			class="col-span-2 mb-4 h-fit"
			published={$entityFormData.published}
		>
			<Field form={entityForm} path="label" class="max-w-64">
				<label for="label">
					<h4 class="h4 mb-2 font-bold">Form Title</h4>
					<Input />
				</label>
			</Field>
		</BuildableFormHeader>
		<Grid
			{gridSettings}
			userBuilding={true}
			class="col-span-2 h-full w-full transition-colors {isDragging
				? 'bg-surface-100-800-token bg-opacity-50'
				: ''}"
		>
			{#each $entityFormData.fields as field, i}
				{@const fieldMetadata = fields[field.properties.fieldType]}
				{@const FieldInput = fieldMetadata.component.render}
				<BuildableFieldContainer
					item={field.layout as BuildableField['layout']}
					min={fieldMetadata.layout.min}
					onDelete={deleteField}
					onMoveEnd={updateFieldLayout}
					onResizeEnd={updateFieldLayout}
					onclick={() => setActiveField(field as BuildableField)}
				>
					<Field class="-mt-0" form={entityForm} path="fields[{i}].properties.placeholder">
						<Label label={field.properties.label}></Label>
						<FieldInput />
					</Field>
				</BuildableFieldContainer>
			{/each}
			{#snippet fieldPreview()}
				{#if draggedField && dragEvent}
					{@const FieldInput = draggedField.component.render}
					<BuildableFieldContainer
						item={draggedField.layout}
						min={draggedField.layout.min}
						{dragEvent}
						onDelete={() => null}
					>
						<Field class="-mt-0" form={entityForm} path="">
							<Label label={draggedField.properties.label}></Label>
							<FieldInput />
						</Field>
					</BuildableFieldContainer>
				{/if}
			{/snippet}
		</Grid>
	</FormContainer>
</div>
