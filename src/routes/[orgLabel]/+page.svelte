<script lang="ts">
	import { Grid, setGridContext } from '$lib/components/user-grid';
	import {
		BuildableFieldContainer,
		BuildableFieldPreview,
		BuildableFormFieldButtons,
		BuildableFormFieldForm,
		BuildableFormFieldMenuHeader,
		Field,
		initForm,
		Label,
		previewFieldItemFromFieldSettings,
		setBuildableFormFieldMenuState,
		type BuildableField
	} from '$src/lib/components/forms';
	import { entityFieldSchema, entitySchema } from '$src/schemas/index.js';

	let { data } = $props();
	let entityForm = initForm({ form: data.entityForm, schema: entitySchema });
	let { form: entityFormData } = entityForm;
	let entityFieldsForm = initForm({
		form: data.entityFieldsForm,
		schema: entityFieldSchema,
		opts: {
			SPA: true,
			onUpdate({ cancel, form }) {
				cancel();
				if (!fieldMenuState.state.field?.layout) return;
				$entityFormData.fields = [
					...$entityFormData.fields,
					{
						properties: form.data,
						layout: fieldMenuState.state.field.layout
					}
				];
			}
		}
	});
	let { form: entityFieldsFormData } = entityFieldsForm;

	let items = $state<BuildableField[]>(data.usersComponents);
	let gridSettings = setGridContext({ cellSize: 32, bounds: true });
	let draggedField = $state<BuildableField | null>(null);
	let fieldMenuState = setBuildableFormFieldMenuState();
	let rerender = $state(false);

	function ondragend() {
		if (!draggedField) return;
		items.push(draggedField);
		setActiveField(draggedField);
		draggedField = null;
		rerender = !rerender;
	}
	function ondragover(e: DragEvent) {
		if (!draggedField) return;
		draggedField = previewFieldItemFromFieldSettings({
			e,
			entityId: data.entityFormId,
			field: draggedField,
			gridSettings
		});
	}
	function setActiveField(item: BuildableField) {
		fieldMenuState.state = {
			field: item,
			tab: 'properties',
			label: `${item.properties.fieldType} Settings`
		};
		$entityFieldsFormData = { ...$entityFieldsFormData, ...item.properties };
	}
</script>

<div class="flex h-full w-full">
	<div class="ml-4 flex h-full w-full p-4">
		<Grid {ondragover} {gridSettings} userBuilding={true} class="col-span-2 border">
			{#each items as item, i}
				{@const FieldInput = item.component.render}
				<BuildableFieldContainer item={item.layout} onclick={() => setActiveField(item)}>
					<Field class="mt-0!" form={entityForm} path="fields[{i}].properties.name">
						<Label label={item.properties.label}></Label>
						<FieldInput />
					</Field>
				</BuildableFieldContainer>
			{/each}
			{#snippet fieldPreview({ dragEvent })}
				{#key rerender}
					{#if draggedField}
						{@const FieldInput = draggedField.component.render}
						<BuildableFieldPreview item={draggedField.layout} {dragEvent}>
							<Field class="mt-0!" form={entityForm} path="">
								<Label label={draggedField.properties.label}></Label>
								<FieldInput />
							</Field>
						</BuildableFieldPreview>
					{/if}
				{/key}
			{/snippet}
		</Grid>
	</div>
	<div
		class="bg-surface-100-800-token h-full
          w-fit min-w-72 p-4"
	>
		{#key fieldMenuState.state.tab}
			<BuildableFormFieldMenuHeader></BuildableFormFieldMenuHeader>
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
		{/key}
	</div>
</div>
