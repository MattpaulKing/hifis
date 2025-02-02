<script lang="ts">
	import { Debouncer } from '$lib/api';
	import {
		Errors,
		Field,
		FormBtns,
		FormContainer,
		getFormMsgStore,
		initForm,
		InputLookup,
		InputTextArea,
		Label,
		LookupDropdown
	} from '$lib/components/forms';
	import { route } from '$lib/ROUTES';
	import { clientsServicesFormSchema } from '../../schema';
	import { getUser } from '$lib/components/user';
	import type { LookupFieldCtx } from '$lib/interfaces/Lookup';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	let {
		clientServiceForm,
		lookups,
		disabledFields
	}: {
		clientServiceForm: SuperValidated<Infer<typeof clientsServicesFormSchema>>;
		lookups: {
			client: LookupFieldCtx;
			service: LookupFieldCtx;
		};
		disabledFields?: {
			clientId?: boolean;
			serviceId?: boolean;
		};
	} = $props();

	let form = initForm({
		form: clientServiceForm,
		schema: clientsServicesFormSchema
	});

	let { form: formData } = form;
	let possibleDuplicates = $state([]);
	let debouncer = new Debouncer({ callback: fetchDuplicates });
	let msgStore = getFormMsgStore();
	let user = getUser();

	async function fetchDuplicates() {
		if (!$formData.serviceId) return;
		possibleDuplicates = await fetch(
			`${route('GET /api/v1/clients/services')}?clientId=${$formData.clientId}&serviceId=${$formData.serviceId}&lookups=true`
		).then(async (r) => await r.json());
		if (possibleDuplicates.length > 0) {
			msgStore.setMsg({ msg: 'Duplicate detected', status: 'error' });
		}
	}
</script>

<FormContainer
	class="w-full max-w-lg"
	{form}
	action={route('create /[orgLabel]/clients/services/create', {
		orgLabel: user.properties.orgLabel
	})}
>
	{#snippet title()}
		<span>Attach a Client to a Service</span>
	{/snippet}
	<Field {form} path="clientId" disabled={disabledFields?.clientId} lookupCtx={lookups.client}>
		<Label label="Client"></Label>
		<InputLookup onKeydown={() => debouncer.search()} apiRoute={route('GET /api/v1/clients')} />
		<LookupDropdown />
		<Errors />
	</Field>
	<Field {form} path="serviceId" disabled={disabledFields?.serviceId} lookupCtx={lookups.service}>
		<Label label="Service"></Label>
		<InputLookup apiRoute={route('GET /api/v1/services')} />
		<LookupDropdown />
		<Errors />
	</Field>
	<Field {form} path="description" class="col-span-2">
		<Label label="Description"></Label>
		<InputTextArea />
		<Errors />
	</Field>
	<FormBtns></FormBtns>
</FormContainer>
