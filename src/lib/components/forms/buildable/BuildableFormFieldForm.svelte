<script lang="ts">
	import { entityFieldSchema } from '$src/schemas';
	import { Errors, Field, FormContainer, Input, InputCheckbox, InputNumber, Label } from '..';
	import type { FormInitialized } from '$src/lib/interfaces/forms';

	type Props = {
		entityFieldsForm: FormInitialized<typeof entityFieldSchema>;
	};

	let { entityFieldsForm }: Props = $props();
</script>

<FormContainer form={entityFieldsForm} action="" class="h-full w-full p-0">
	<Field form={entityFieldsForm} path="label" class="col-span-2 mt-4">
		<Label label="Label"></Label>
		<Input></Input>
		<Errors></Errors>
	</Field>
	<Field form={entityFieldsForm} path="name" class="col-span-2">
		<Label label="Name"></Label>
		<Input></Input>
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
	<Field form={entityFieldsForm} path="required" class="col-span-2">
		<Label label="Required Field">
			<InputCheckbox class="mr-auto h-8 w-8" />
		</Label>
		<Errors></Errors>
	</Field>

	<div class="col-span-2 mt-6 flex h-min justify-end">
		<button class="variant-filled-success btn">Save</button>
	</div>
</FormContainer>
