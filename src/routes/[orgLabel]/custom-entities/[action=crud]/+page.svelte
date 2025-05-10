<script lang="ts">
	import fields from '$src/lib/components/forms/buildable/fields.js';
	import { Grid, setGridContext, TaintedFieldInputs } from '$lib/components/user-grid';
	import { route } from '$src/lib/ROUTES';
	import { entityFieldLayoutSchema, entityFieldsSchema, entitySchema } from '$src/schemas/index.js';
	import { getModalStore, ModalConfirmation, openModal } from '$src/lib/components/modal/index.js';
	import { page } from '$app/state';
	import { entityPushOrUpdateField } from '../lib';
	import { getToaster } from '$src/lib/components/toast';
	import {
		BuildableFieldContainer,
		BuildableFormFieldInputButtons,
		BuildableInputForm,
		BuildableSelectForm,
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
	import { beforeNavigate, goto } from '$app/navigation';

	let { data } = $props();
	let entityForm = initForm({
		form: data.entityForm,
		schema: entitySchema,
		opts: {
			onSubmit() {
				if (taintedFieldInputs.hasEntries) {
					$entityFormData.fields = taintedFieldInputs.saveTaintedFields({ $entityFormData });
				}
			},
			onUpdate({ form }) {
				if (!form.valid) return;
				taintedFieldInputs.reset();
			}
		}
	});
	let { form: entityFormData } = entityForm;
	let entityFieldsForm = initForm({
		form: data.entityFieldsForm,
		schema: entityFieldsSchema,
		opts: {
			invalidateAll: false,
			applyAction: false,
			onUpdate({ form }) {
				const idx = $entityFormData.fields.findIndex(
					({ properties: { id } }) => id === form.data.id
				);
				if (idx < 0) return;
				$entityFormData.fields[idx].properties = form.data;
				if (form.data.id && form.data.id in taintedFieldInputs.fields) {
					delete taintedFieldInputs.fields[form.data.id];
				}
				toaster.add({ type: 'save', message: 'Saved' });
			}
		}
	});
	let { form: entityFieldsFormData, isTainted: entityFieldsFormTainted } = entityFieldsForm;

	let entityFieldLayoutForm = initForm({
		form: data.entityFieldLayoutForm,
		schema: entityFieldLayoutSchema,
		opts: {
			invalidateAll: false,
			applyAction: false
		}
	});
	let { form: entityFieldLayoutFormData } = entityFieldLayoutForm;

	let modalStore = getModalStore();
	let toaster = getToaster();
	let gridSettings = setGridContext({ cellSize: 16, bounds: true });
	let draggedField = $state<BuildableFieldDefault | null>(null);
	let isDragging = $derived(Boolean(draggedField));
	let fieldMenuState = setBuildableFormFieldMenuState();
	let dragEvent = $state<DragEvent | null>(null);
	let taintedFieldInputs = new TaintedFieldInputs({});

	beforeNavigate(async (nav) => {
		if (nav.type === 'form') return;
		if (nav.to) {
			nav.cancel();
			await promptToSaveChanges();
			await goto(nav.to?.url);
		}
	});

	function setActiveField(field: BuildableField) {
		$entityFormData = entityPushOrUpdateField({ $entityFormData, fieldKey: 'properties', field });
		entityFieldsFormData.update(() => field.properties, { taint: false });
		$entityFieldLayoutFormData = field.layout;
		fieldMenuState.setInputField(field);
	}

	function submitField(field: BuildableFieldDefault) {
		setActiveField(field);
		entityFieldsForm.submit();
		entityFieldLayoutForm.submit();
	}

	async function promptToSaveChanges() {
		if (entityFieldsFormTainted()) {
			await openModal({
				modalStore,
				id: $entityFieldsFormData.id,
				ref: ModalConfirmation,
				props: () => ({
					id: $entityFieldsFormData,
					message: "There are changes that haven't been saved!"
				}),
				routes: { from: page.url.href, to: page.url.href }
			}).then((r) => {
				if (r?.type === 'save' && $entityFieldsFormData.id) {
					$entityFormData = entityPushOrUpdateField({
						$entityFormData,
						fieldKey: 'properties',
						field: { properties: $entityFieldsFormData, layout: $entityFieldLayoutFormData }
					});
					taintedFieldInputs.remove($entityFieldsFormData.id);
					entityForm.submit();
				} else if ($entityFieldsFormData.id) {
					taintedFieldInputs.fields[$entityFieldsFormData.id] = $entityFieldsFormData;
				}
				modalStore.close();
			});
		}
	}
	async function updateFieldLayout(layout: BuildableField['layout']) {
		console.log($entityFieldsFormData);
		if (entityFieldsFormTainted() && $entityFieldsFormData.id) {
			taintedFieldInputs.fields[$entityFieldsFormData.id] = $entityFieldsFormData;
		}
		let idx = $entityFormData.fields.findIndex(({ layout: { id } }) => id === layout.id);
		if (idx < 0) return;
		//@ts-expect-error HACK: id has to exist at this point on properties
		setActiveField({ ...$entityFormData.fields[idx], layout });
		entityFieldLayoutForm.submit();
	}
	function deleteField() {
		fieldMenuState.default();
	}
	function saveGrid() {
		entityForm.submit();
		fieldMenuState.default();
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
					<BuildableFormFieldInputButtons
						bind:draggedField
						bind:dragEvent
						entityFormId={data.entityId}
						{gridSettings}
						ondragend={submitField}
					></BuildableFormFieldInputButtons>
				{:else if fieldMenuState.state.tab === 'properties'}
					{#key $entityFieldsFormData.id}
						{#if fieldMenuState.state.field.properties.fieldType === 'input'}
							<BuildableInputForm {entityFieldsForm}></BuildableInputForm>
						{:else if fieldMenuState.state.field.properties.fieldType === 'lookup'}
							<BuildableSelectForm {entityFieldsForm}></BuildableSelectForm>
						{/if}
					{/key}
				{/if}
			</div>
		</FormContainer>
	</BuildableFormFieldMenuContainer>
	<form
		class="flex h-full w-full flex-col items-center justify-center px-6 pb-6"
		method="POST"
		use:entityForm.enhance
		action={route('default /[orgLabel]/custom-entities/[action=crud]', {
			orgLabel: data.org.label,
			action: data.action
		})}
	>
		<BuildableFormHeader
			class="col-span-2 mb-4 h-fit"
			published={$entityFormData.published}
			taintedInputFieldsExist={taintedFieldInputs.hasEntries}
			bind:screenView={gridSettings.screenView}
			onSave={saveGrid}
			onPublishClick={() => {
				$entityFormData.published = !$entityFormData.published;
				saveGrid();
			}}
		>
			<div class="-mt-2 flex h-full w-full place-items-start gap-x-4">
				<Field form={entityForm} path="label" class="max-w-64">
					<label for="label">
						<h4 class="h4 mb-2 ml-1 font-bold">Form Title</h4>
						<Input />
					</label>
				</Field>
				<Field form={entityForm} path="description" class="w-full max-w-xl">
					<Label label="Description"></Label>
					<Input placeholder="What's the entity for?" />
				</Field>
			</div>
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
					taintedFieldInputs={taintedFieldInputs.fields}
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
	class="h-0 w-0 opacity-0"
	form={entityFieldLayoutForm}
	action={route('default /[orgLabel]/custom-entities/layouts', {
		orgLabel: data.org.label
	})}
	showMsg={false}
>
	<div></div>
</FormContainer>
