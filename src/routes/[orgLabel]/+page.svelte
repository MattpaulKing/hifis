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
		buildableFieldDefault,
		setBuildableFormFieldMenuState,
		updateEntityFields,
		type BuildableField,
		type BuildableFieldPreview
	} from '$src/lib/components/forms';
	import fields from '$src/lib/components/forms/buildable/fields.js';
	import { route } from '$src/lib/ROUTES';
	import { entityFieldSchema, entitySchema } from '$src/schemas/index.js';

	let { data } = $props();
	let entityForm = initForm({
		form: data.entityForm,
		schema: entitySchema
	});
	let { form: entityFormData, enhance } = entityForm;

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
	let gridSettings = setGridContext({ cellSize: 32, bounds: true });
	let draggedField = $state<BuildableFieldPreview | null>(null);
	let fieldMenuState = setBuildableFormFieldMenuState();
	let rerender = $state(false);

	function ondragend() {
		if (!draggedField) return;
		let newField = {
			properties: { ...draggedField.properties, entityId: $entityFormData.id ?? '' },
			layout: draggedField.layout
		};
		draggedField = null;
		$entityFormData.fields = [...$entityFormData.fields, newField];
		setActiveField(newField);
		rerender = !rerender;
	}
	function ondragover(e: DragEvent) {
		if (!draggedField) return;
		draggedField = buildableFieldDefault({
			e,
			entityId: data.entityFormId,
			field: draggedField,
			gridSettings
		});
	}
	$inspect(draggedField);
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
    updating existing forms
    publishing / creating forms
  */
</script>

<div class="flex h-full w-full">
	<div
		class="bg-surface-100-800-token border-surface-500-400-token z-10 h-full w-fit min-w-72 border-x border-t p-4"
	>
		<form
			method="POST"
			action={route('default /[orgLabel]', { orgLabel: data.org.label })}
			use:enhance
		>
			<BuildableFormFieldMenuHeader></BuildableFormFieldMenuHeader>
		</form>
		{#if fieldMenuState.state.tab === 'field-list'}
			<BuildableFormFieldButtons
				bind:draggedField
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
	</div>
	<div class="ml-4 flex h-full w-full bg-surface-800 p-4">
		<Grid {ondragover} {gridSettings} userBuilding={true} class="col-span-2 border">
			{#each $entityFormData.fields as field, i}
				{@const fieldMetadata = fields[field.properties.fieldType]}
				{@const FieldInput = fieldMetadata.component.render}
				<BuildableFieldContainer
					item={field.layout as BuildableFieldPreview['layout']}
					min={fieldMetadata.layout.min}
					onMoveEnd={updateFieldLayout}
					onResizeEnd={updateFieldLayout}
					onclick={() => setActiveField(field as BuildableFieldPreview)}
				>
					<Field class="mt-0" form={entityForm} path="fields[{i}].properties.placeholder">
						<Label label={field.properties.label}></Label>
						<FieldInput />
					</Field>
				</BuildableFieldContainer>
			{/each}
			{#snippet fieldPreview({ dragEvent })}
				{#key rerender}
					{#if draggedField}
						{@const FieldInput = draggedField.component.render}
						<BuildableFieldContainer
							item={draggedField.layout}
							min={draggedField.layout.min}
							{dragEvent}
						>
							<Field class="mt-0" form={entityForm} path="">
								<Label label={draggedField.properties.label}></Label>
								<FieldInput />
							</Field>
						</BuildableFieldContainer>
					{/if}
				{/key}
			{/snippet}
		</Grid>
	</div>
</div>
