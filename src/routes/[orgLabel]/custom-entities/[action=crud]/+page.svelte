<script lang="ts">
	import fields from '$src/lib/components/forms/buildable/fields.js';
	import { Grid, setGridContext } from '$lib/components/user-grid';
	import { route } from '$src/lib/ROUTES';
	import { entityFieldLayoutSchema, entityFieldsSchema, entitySchema } from '$src/schemas/index.js';
	import { getToaster } from '$src/lib/components/toast';
	import {
		BuildableFieldContainer,
		BuildableFormFieldButtons,
		BuildableFormFieldForm,
		BuildableFormFieldMenuHeader,
		Field,
		initForm,
		Label,
		setBuildableFormFieldMenuState,
		BuildableFormHeader,
		Input,
		FormContainer,
		BuildableFormFieldMenuContainer,
		type BuildableField,
		type BuildableFieldDefault
	} from '$src/lib/components/forms';

	let { data } = $props();
	let entityForm = initForm({
		form: data.entityForm,
		schema: entitySchema
	});
	let { form: entityFormData } = entityForm;

	let entityFieldsForm = initForm({
		form: data.entityFieldsForm,
		schema: entityFieldsSchema,
		opts: {
			invalidateAll: false,
			applyAction: false,
			onUpdate(event) {
				const idx = $entityFormData.fields.findIndex(
					({ properties: { id } }) => id === event.form.data.id
				);
				if (idx < 0) return;
				$entityFormData.fields[idx].properties = event.form.data;
				toaster.add({ type: 'save', message: 'Saved' });
			}
		}
	});
	let { form: entityFieldsFormData } = entityFieldsForm;
	let entityFieldLayoutForm = initForm({
		form: data.entityFieldLayoutForm,
		schema: entityFieldLayoutSchema,
		opts: {
			invalidateAll: false,
			applyAction: false
		}
	});
	let { form: entityFieldLayoutFormData } = entityFieldLayoutForm;

	let toaster = getToaster();
	let gridSettings = setGridContext({ cellSize: 16, bounds: true });
	let draggedField = $state<BuildableFieldDefault | null>(null);
	let isDragging = $derived(Boolean(draggedField));
	let fieldMenuState = setBuildableFormFieldMenuState();
	let dragEvent = $state<DragEvent | null>(null);

	function setActiveField(field: BuildableField) {
		let idx = $entityFormData.fields.findIndex(
			({ properties: { id } }) => id === field.properties.id
		);
		if (idx >= 0) {
			$entityFormData.fields[idx] = field;
		} else {
			$entityFormData.fields = [...$entityFormData.fields, field];
		}
		$entityFieldsFormData = field.properties;
		$entityFieldLayoutFormData = field.layout;
		fieldMenuState.state = {
			field,
			tab: 'properties',
			label: `${field.properties.fieldType} Settings`
		};
	}

	function submitField(field: BuildableFieldDefault) {
		setActiveField(field);
		entityFieldsForm.submit();
		entityFieldLayoutForm.submit();
	}

	function updateFieldLayout(layout: BuildableField['layout']) {
		let idx = $entityFormData.fields.findIndex(({ layout: { id } }) => id === layout.id);
		if (idx < 0) return;
		//@ts-expect-error HACK: id has to exist at this point on properties
		setActiveField({ ...$entityFormData.fields[idx], layout });
		entityFieldLayoutForm.submit();
	}
	function deleteField(layoutItem: BuildableField['layout']) {
		$entityFormData.fields = $entityFormData.fields.filter(
			({ layout: { id } }) => id !== layoutItem.id
		);
		if (fieldMenuState.state.field?.layout.id === layoutItem.id) {
			fieldMenuState.default();
		}
	}
</script>

<div class="flex h-full w-full">
	<BuildableFormFieldMenuContainer rerenderKey={fieldMenuState.state.field?.properties.id}>
		<BuildableFormFieldMenuHeader></BuildableFormFieldMenuHeader>
		<FormContainer
			form={entityFieldsForm}
			action={route('createOrUpdate /[orgLabel]/custom-entities/properties', {
				orgLabel: data.org.label
			})}
			class="p-0"
			showMsg={false}
		>
			<div class="col-span-2 flex h-full flex-col">
				{#if fieldMenuState.state.tab === 'field-list'}
					<BuildableFormFieldButtons
						bind:draggedField
						bind:dragEvent
						entityFormId={data.entityId}
						{gridSettings}
						ondragend={submitField}
					></BuildableFormFieldButtons>
				{:else if fieldMenuState.state.tab === 'properties'}
					{#if fieldMenuState.state.field.properties.fieldType === 'input'}
						<BuildableFormFieldForm {entityFieldsForm}></BuildableFormFieldForm>
					{:else if fieldMenuState.state.field.properties.fieldType === 'lookup'}
						<div></div>
					{/if}
				{/if}
			</div>
		</FormContainer>
	</BuildableFormFieldMenuContainer>
	<form
		class="flex h-full w-full flex-col px-6 pb-6"
		method="POST"
		use:entityForm.enhance
		action={route('default /[orgLabel]/custom-entities/[action=crud]', {
			orgLabel: data.org.label,
			action: data.action
		})}
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
					<h4 class="h4 mb-2 ml-1 font-bold">Form Title</h4>
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
					onChanged={updateFieldLayout}
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
						<Field class="-mt-0" form={entityFieldsForm} path="placeholder">
							<Label label={draggedField.properties.label}></Label>
							<FieldInput />
						</Field>
					</BuildableFieldContainer>
				{/if}
			{/snippet}
		</Grid>
	</form>
</div>
<FormContainer
	class="hidden"
	form={entityFieldLayoutForm}
	action={route('default /[orgLabel]/custom-entities/layouts', {
		orgLabel: data.org.label
	})}
	showMsg={false}
>
	<div></div>
</FormContainer>
