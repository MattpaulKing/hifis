<script lang="ts">
	import {
		FormContainer,
		FormTitle,
		Field,
		Label,
		Input,
		Errors,
		initClientForm
	} from '$lib/components/forms';
	import { route } from '$lib/ROUTES';
	import { organizationInsertSchema } from '../schema/index';

	let { data } = $props();
	const form = initClientForm({ form: data.orgForm, schema: organizationInsertSchema });
	const { form: form_ } = form;
	$inspect($form_);
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<FormContainer
		class="min-w-96 max-w-2xl"
		{form}
		action={route('default /[organization]/[crud=crud]', { organization: '123', crud: 'update' })}
	>
		<FormTitle>Organization</FormTitle>
		<Field {form} path="label" class="col-span-2">
			<Label label="Organization Name" />
			<Input type="text" />
			<Errors />
		</Field>
		<Field {form} path="email" class="col-span-2">
			<Label label="Email" />
			<Input type="email" />
			<Errors />
		</Field>
		<div class="col-span-2 mt-6 flex w-full justify-end">
			<button class="variant-filled-primary btn">Update</button>
		</div>
	</FormContainer>
</div>
