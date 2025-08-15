<script lang="ts">
	import { entityFieldsSchema } from '$src/schemas';
	import type { FormInitialized } from '$src/lib/interfaces/forms';
	import {
		Errors,
		Field,
		Input,
		InputCheckbox,
		InputNumber,
		Label
	} from '$src/lib/components/forms';
	import { onMount } from 'svelte';
	import { getBuildableGridController } from '../BuildableGridController.svelte';

	type Props = {
		entityFieldForm: FormInitialized<typeof entityFieldsSchema>;
	};
	let { entityFieldForm }: Props = $props();
	let { form: entityFieldsFormData } = entityFieldForm;
	let controller = getBuildableGridController();
	onMount(() => {
		let idx = controller.items.fields.findIndex(
			({ properties: { id } }) => id === controller.menu.fieldId
		);
		$entityFieldsFormData = controller.items.fields[idx].properties;
	});
	let minMaxAttr =
		$entityFieldsFormData.inputType === 'text'
			? 'Characters'
			: $entityFieldsFormData.inputType === 'number'
				? 'Number'
				: '';
</script>

<div class="col-span-2 h-fit w-full p-0">
	<Field form={entityFieldForm} path="label" class="mt-0">
		<Label label="Label"></Label>
		<Input></Input>
		<Errors></Errors>
	</Field>
	<Field form={entityFieldForm} path="name" class="">
		<Label label="Name"></Label>
		<Input></Input>
		<Errors></Errors>
	</Field>
	<Field form={entityFieldForm} path="placeholder" class="">
		<Label label="Placeholder"></Label>
		<Input></Input>
		<Errors></Errors>
	</Field>
	<Field form={entityFieldForm} path="min" class="">
		<Label label="Minimum {minMaxAttr}"></Label>
		<InputNumber></InputNumber>
		<Errors></Errors>
	</Field>
	<Field form={entityFieldForm} path="max" class="">
		<Label label={`Maximum ${minMaxAttr}`}></Label>
		<InputNumber></InputNumber>
		<Errors></Errors>
	</Field>
	<Field form={entityFieldForm} path="required" class="">
		<Label label="Required Field">
			<InputCheckbox class="mr-auto h-8 w-8" />
		</Label>
		<Errors></Errors>
	</Field>
	<div class="my-6 flex h-min justify-end">
		<button class="variant-filled-success btn">Save</button>
	</div>
</div>
