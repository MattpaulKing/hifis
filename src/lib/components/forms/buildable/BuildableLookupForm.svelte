<script lang="ts">
	import { entityFieldsSchema } from '$src/schemas';
	import {
		Errors,
		Field,
		FieldArray,
		Input,
		InputCheckbox,
		InputLookup,
		InputNumber,
		Label,
		BuildableInputOptionsDropdown,
		LookupStore
	} from '..';
	import type { FormInitialized } from '$src/lib/interfaces/forms';

	type Props = {
		entityFieldsForm: FormInitialized<typeof entityFieldsSchema>;
	};
	let { entityFieldsForm }: Props = $props();
	let { form: entityFieldsFormData, errors } = entityFieldsForm;
	let inputLookupStore = new LookupStore({
		lookups: $entityFieldsFormData.inputOptions,
		inputValue: ''
	});

	function handleDisabledClick() {
		if (!$entityFieldsFormData.multiple) {
			$errors.multiple = [
				'Multiple selections have to be allowed to specify minimum or maximum selections.'
			];
		}
	}
	let optionsInputEl = $state<HTMLInputElement>();
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
	<Field form={entityFieldsForm} path="entityLookupId" class="">
		<Label label="Placeholder" />
		<Input />
		<Errors></Errors>
	</Field>
	<FieldArray form={entityFieldsForm} path="inputOptions" lookups={inputLookupStore} class="">
		<Label label="Options" />
		<InputLookup
			title={$entityFieldsFormData.inputOptions?.map(({ label }) => label).join(', ')}
			apiRoute={null}
			placeholder="Add options"
			bind:inputEl={optionsInputEl}
			onkeydown={(e) => {
				if (e.key !== 'Enter') return;
				e.preventDefault();
				let newLookup = { id: crypto.randomUUID(), label: inputLookupStore.inputValue };
				$entityFieldsFormData.inputOptions = [...$entityFieldsFormData.inputOptions, newLookup];
				inputLookupStore.lookups.push(newLookup);
				inputLookupStore.inputValue = '';
			}}
		/>
		<BuildableInputOptionsDropdown onclick={() => optionsInputEl?.focus()} />
		<Errors></Errors>
	</FieldArray>
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
