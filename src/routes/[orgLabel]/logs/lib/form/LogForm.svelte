<script lang="ts">
	import {
		Field,
		FieldArray,
		FormBtns,
		FormContainer,
		initForm,
		InputLookup,
		InputTextArea,
		Label,
		LookupDropdown
	} from '$src/lib/components/forms';
	import { logsFormSchema } from '../../schema';
	import { route } from '$src/lib/ROUTES';
	import { getUser } from '$src/lib/components/user';
	import type { FormValidated } from '$src/lib/interfaces';
	import type { LookupStore } from '$src/lib/components/forms/inputs/LookupStore.svelte';

	let {
		logForm,
		mode,
		lookups
	}: {
		logForm: FormValidated<typeof logsFormSchema>;
		mode: 'create' | 'update';
		lookups: { services: LookupStore; clients: LookupStore };
	} = $props();
	let form = initForm({
		form: logForm,
		schema: logsFormSchema,
		opts: {
			onUpdate(e) {}
		}
	});
	let user = getUser();
	let action = $derived(
		mode === 'create'
			? route('create /[orgLabel]/logs', { orgLabel: user.properties.orgLabel })
			: ''
	);
	$inspect(lookups.services);
</script>

<FormContainer class="min-w-96 max-w-lg" {form} {action}>
	<FieldArray {form} path="serviceIds" lookups={lookups.services}>
		<Label label="Service(s)"></Label>
		<InputLookup apiRoute={route('GET /api/v1/services')}></InputLookup>
		<LookupDropdown></LookupDropdown>
	</FieldArray>
	<FieldArray {form} path="clientIds" lookups={lookups.clients}>
		<Label label="Client(s)"></Label>
		<InputLookup apiRoute={route('GET /api/v1/clients')}></InputLookup>
		<LookupDropdown></LookupDropdown>
	</FieldArray>
	<Field {form} path="note" class="col-span-2">
		<Label label="Log Note"></Label>
		<InputTextArea></InputTextArea>
	</Field>
	<FormBtns></FormBtns>
</FormContainer>
