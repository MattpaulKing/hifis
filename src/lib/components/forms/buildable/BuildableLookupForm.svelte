<script lang="ts">
	import { entityFieldsSchema } from '$src/schemas';
	import {
		Errors,
		Field,
		Input,
		InputCheckbox,
		InputLookup,
		InputNumber,
		Label,
		BuildableInputOptionsDropdown,
		LookupStore
	} from '..';
	import { route } from '$src/lib/ROUTES';
	import type { FormInitialized } from '$src/lib/interfaces/forms';
	import type { Lookup } from '$src/lib/interfaces/Lookup';

	type Props = {
		entityFieldsForm: FormInitialized<typeof entityFieldsSchema>;
	};
	let { entityFieldsForm }: Props = $props();
	let { form: entityFieldsFormData, errors } = entityFieldsForm;

	function handleDisabledClick() {
		if (!$entityFieldsFormData.multiple) {
			$errors.multiple = [
				'Multiple selections have to be allowed to specify minimum or maximum selections.'
			];
		}
	}
	let optionsInputEl = $state<HTMLInputElement>();
	let entityLookups = new LookupStore({ lookups: [], inputValue: '' });

	async function getEntities() {
		let entities = await fetch(route('GET /api/v1/entities/discover')).then(
			async (r) => (await r.json()) as Lookup[]
		);
		if ($entityFieldsFormData.entityLookupId) {
			let entitySelected = entities.find(({ id }) => id === $entityFieldsFormData.entityLookupId);
			entityLookups.inputValue = entitySelected?.label ?? '';
		}
		entityLookups.lookups = entities;
	}
</script>

<div class="h-fit w-full p-0">
	<Field form={entityFieldsForm} path="label" class="mt-0">
		<Label label="Label"></Label>
		<Input></Input>
		<Errors></Errors>
	</Field>
	<Field form={entityFieldsForm} path="name" class="">
		<Label label="Name"></Label>
		<Input></Input>
		<Errors></Errors>
	</Field>
	<Field form={entityFieldsForm} path="multiple" class="">
		<Label label="Multiple Selections">
			<InputCheckbox class="mr-auto h-6 w-6" />
		</Label>
		<Errors></Errors>
	</Field>
	<Field form={entityFieldsForm} path="required" class="">
		<Label label="Required Field">
			<InputCheckbox class="mr-auto h-6 w-6" />
		</Label>
		<Errors></Errors>
	</Field>
	<Field form={entityFieldsForm} path="entityLookupId" class="" lookups={entityLookups}>
		<Label label="Entity" />
		{#await getEntities()}
			<InputLookup
				apiRoute={route('GET /api/v1/entities/discover')}
				placeholder="Entity Referenced"
				bind:inputEl={optionsInputEl}
			/>
		{:then}
			<InputLookup
				apiRoute={route('GET /api/v1/entities/discover')}
				placeholder="Entity Referenced"
				bind:inputEl={optionsInputEl}
			/>
			<BuildableInputOptionsDropdown />
		{/await}
		<Errors></Errors>
	</Field>
	<Field form={entityFieldsForm} path="min" class="" disabled={!$entityFieldsFormData.multiple}>
		<Label label="Minimum selections"></Label>
		<InputNumber onclick={handleDisabledClick}></InputNumber>
		<Errors></Errors>
	</Field>
	<Field form={entityFieldsForm} path="max" class="" disabled={!$entityFieldsFormData.multiple}>
		<Label label="Maximum selections"></Label>
		<InputNumber></InputNumber>
		<Errors></Errors>
	</Field>
	<div class="my-6 flex h-min justify-end">
		<button class="variant-filled-success btn">Save</button>
	</div>
</div>
