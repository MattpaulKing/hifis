<script lang="ts">
	import { entityFieldSchema } from '$src/schemas';
	import { Errors, Field, FormContainer, Input, InputCheckbox, InputNumber, Label } from '..';
	import type { FormInitialized } from '$src/lib/interfaces/forms';

	type Props = {
		entityFieldsForm: FormInitialized<typeof entityFieldSchema>;
	};

	let { entityFieldsForm }: Props = $props();
</script>

<FormContainer hasFormEl={false} form={entityFieldsForm} action="" class="h-fit w-full p-0">
	<form method="POST" action="" use:entityFieldsForm.enhance class="absolute flex w-full flex-col">
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
		<Field form={entityFieldsForm} path="placeholder" class="">
			<Label label="Placeholder"></Label>
			<Input></Input>
			<Errors></Errors>
		</Field>
		<Field form={entityFieldsForm} path="min" class="">
			<Label label="Minimum Characters"></Label>
			<InputNumber></InputNumber>
			<Errors></Errors>
		</Field>
		<Field form={entityFieldsForm} path="max" class="">
			<Label label="Maximum Characters"></Label>
			<InputNumber></InputNumber>
			<Errors></Errors>
		</Field>
		<Field form={entityFieldsForm} path="required" class="">
			<Label label="Required Field">
				<InputCheckbox class="mr-auto h-8 w-8" />
			</Label>
			<Errors></Errors>
		</Field>
		<div class="my-6 flex h-min justify-end">
			<button class="variant-filled-success btn">Save</button>
		</div>
	</form>
</FormContainer>
