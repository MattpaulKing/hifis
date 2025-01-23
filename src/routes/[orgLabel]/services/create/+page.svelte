<script lang="ts">
	import {
		Errors,
		Field,
		FormContainer,
		initClientForm,
		Input,
		Label
	} from '$lib/components/forms';
	import { route } from '$lib/ROUTES';
	import { servicesFormSchema } from '../schema';

	let { data } = $props();
	let form = initClientForm({
		form: data.serviceForm,
		schema: servicesFormSchema,
		opts: {
			resetForm: true
		}
	});
</script>

<FormContainer
	{form}
	action={route('create /[orgLabel]/services/create', { orgLabel: data.orgLabel })}
>
	{#snippet title()}
		<span>Add a Service</span>
	{/snippet}
	<Field {form} path="label">
		<Label label="Name"></Label>
		<Input type="text" />
		<Errors />
	</Field>
	<Field {form} path="email">
		<Label label="Email"></Label>
		<Input type="email" />
		<Errors />
	</Field>
	<Field {form} path="phone">
		<Label label="Phone"></Label>
		<Input type="tel" />
		<Errors />
	</Field>
	<Field {form} path="address">
		<Label label="Street Address"></Label>
		<Input type="text" />
		<Errors />
	</Field>
	<div class="col-span-2 mt-6 flex justify-between">
		<div></div>
		<button class="variant-filled-success btn"> Save </button>
	</div>
</FormContainer>
