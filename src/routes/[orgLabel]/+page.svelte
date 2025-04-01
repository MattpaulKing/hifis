<script lang="ts">
	import { Grid, setGridContext } from '$lib/components/user-grid';
	import {
		BuildableFieldContainer,
		BuildableFieldPreview,
		buildableFormFields,
		Errors,
		Field,
		FormContainer,
		initForm,
		Input,
		InputCheckbox,
		InputNumber,
		Label,
		previewFieldItemFromFieldSettings,
		type BuildableField
	} from '$src/lib/components/forms';
	import { entityFieldSchema, entitySchema } from '$src/schemas/index.js';
	import { ArrowLeftIcon } from '@lucide/svelte';
	import { fade, slide } from 'svelte/transition';

	let { data } = $props();
	let entityForm = initForm({ form: data.entityForm, schema: entitySchema });
	let { form: entityFormData } = entityForm;
	let entityFieldsForm = initForm({ form: data.entityFieldsForm, schema: entityFieldSchema });
	let { form: entityFieldsFormData } = entityFieldsForm;

	let items = $state<BuildableField[]>(data.usersComponents);

	let gridSettings = setGridContext({ cellSize: 32, bounds: true });
	let draggedField = $state<BuildableField | null>(null);
	type FieldMenuState =
		| {
				field: null;
				fieldIdx: null;
				tab: 'field-list';
				label: string;
		  }
		| {
				field: BuildableField;
				fieldIdx: number;
				tab: 'properties' | 'layout';
				label: string;
		  };
	let fieldMenuState = $state<FieldMenuState>(fieldMenuStateDefault());
	let rerender = $state(false);

	function ondragstart(e: DragEvent, field: BuildableField) {
		draggedField = previewFieldItemFromFieldSettings({
			e,
			field,
			gridSettings
		});
	}
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
			field: draggedField,
			gridSettings
		});
	}
	function setActiveField(item: BuildableField) {
		fieldMenuState = {
			field: item,
			fieldIdx: items.findIndex(({ id }) => id === item.id),
			tab: 'properties',
			label: `${item.properties.fieldType} Settings`
		};
		$entityFieldsFormData = { ...item.properties };
	}
	function fieldMenuStateDefault() {
		return {
			field: null,
			fieldIdx: null,
			tab: 'field-list' as const,
			label: 'Elements'
		};
	}
</script>

<div class="flex h-full w-full">
	<div class="ml-4 flex h-full w-full p-4">
		<Grid {ondragover} {gridSettings} userBuilding={true} class="col-span-2 border">
			{#each items as item, i}
				{@const FieldInput = item.component.render}
				<BuildableFieldContainer item={item.layout} onclick={() => setActiveField(item)}>
					<Field class="mt-0!" form={entityForm} path="">
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
							<Field form={entityForm} path="">
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
		{#key fieldMenuState.tab}
			<div class="col-span-2 flex w-full justify-between">
				<span class="text-lg font-bold capitalize">{fieldMenuState.label}</span>
				<button
					onclick={() => (fieldMenuState = fieldMenuStateDefault())}
					disabled={fieldMenuState.tab === 'field-list'}
					class="group variant-ghost btn-icon btn-icon-sm rounded-token hover:variant-soft"
				>
					<ArrowLeftIcon
						class="transition-transform {fieldMenuState.tab !== 'field-list'
							? 'group-hover:-translate-x-1'
							: ''}"
					></ArrowLeftIcon>
				</button>
			</div>
			{#if fieldMenuState.tab === 'field-list'}
				<div class="col-span-2 mb-4 flex flex-col">
					<span class="col-span-2 my-2 px-2">Fields</span>
					<hr class="divider border-surface-500-400-token mt-1" />
				</div>
				{#each Object.values(buildableFormFields) as field}
					{@const Icon = field.component.icon}
					<button
						draggable={true}
						ondragstart={(e) => ondragstart(e, field)}
						{ondragend}
						class="variant-ghost btn btn-sm w-fit"
					>
						<span class="p-1 rounded-token">
							<Icon size={20} />
						</span>
						<span class="">{field.component.title}</span>
					</button>
				{/each}
			{:else if fieldMenuState.tab === 'properties'}
				{#if fieldMenuState.field.properties.fieldType === 'input'}
					<FormContainer form={entityFieldsForm} action="" class="h-full w-full p-0">
						<Field form={entityFieldsForm} path="label" class="col-span-2">
							<Label label="Label"></Label>
							<Input></Input>
							<Errors></Errors>
						</Field>
						<Field form={entityFieldsForm} path="name" class="col-span-2">
							<Label label="Name"></Label>
							<Input></Input>
							<Errors></Errors>
						</Field>
						<Field form={entityFieldsForm} path="required" class="col-span-2">
							<Label label="Required Field">
								<InputCheckbox class="mr-auto h-8 w-8" />
							</Label>
							<Errors></Errors>
						</Field>
						<Field form={entityFieldsForm} path="placeholder" class="col-span-2">
							<Label label="Placeholder"></Label>
							<Input></Input>
							<Errors></Errors>
						</Field>
						<Field form={entityFieldsForm} path="min" class="col-span-2">
							<Label label="Minimum Characters"></Label>
							<InputNumber></InputNumber>
							<Errors></Errors>
						</Field>
						<Field form={entityFieldsForm} path="max" class="col-span-2">
							<Label label="Maximum Characters"></Label>
							<InputNumber></InputNumber>
							<Errors></Errors>
						</Field>
						<div class="col-span-2 mt-6 flex h-min justify-end">
							<button class="variant-filled-success btn">Save</button>
						</div>
					</FormContainer>
				{:else if fieldMenuState.field.properties.fieldType === 'lookup'}
					<div></div>
				{/if}
			{/if}
		{/key}
	</div>
</div>
