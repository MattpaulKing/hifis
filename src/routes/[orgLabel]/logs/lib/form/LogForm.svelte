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
	import type { LookupFieldCtx } from '$src/lib/interfaces/Lookup';

	let {
		logForm,
		mode,
		lookups
	}: {
		logForm: FormValidated<typeof logsFormSchema>;
		mode: 'create' | 'update';
		lookups: { services: LookupFieldCtx; clients: LookupFieldCtx };
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
	form.errors.subscribe((e) => console.log(e));
</script>

<FormContainer class="min-w-96 max-w-lg" {form} {action}>
	<FieldArray {form} path="serviceIds" lookupCtx={lookups.services}>
		<Label label="Service(s)"></Label>
		<InputLookup apiRoute={route('GET /api/v1/services')}></InputLookup>
	</FieldArray>
	<FieldArray {form} path="clientIds" lookupCtx={lookups.clients}>
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
