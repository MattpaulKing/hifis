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
	import { clientServiceFormSchema } from '../../schema';
	import { getUser } from '$lib/components/user';
	import type { FormOptions, Infer, SuperValidated } from 'sveltekit-superforms';
	import type { LookupStore } from '$src/lib/components/forms/inputs/LookupStore.svelte';
	import type { CRUD } from '$src/params/crud';

	let {
		clientServiceForm,
		action,
		formOpts,
		lookups = $bindable(),
		disabledFields
	}: {
		clientServiceForm: SuperValidated<Infer<typeof clientServiceFormSchema>>;
		action: CRUD;
		formOpts?: FormOptions<Infer<typeof clientServiceFormSchema>>;
		lookups: {
			clients: LookupStore;
			services: LookupStore;
		};
		disabledFields?: {
			clientId?: boolean;
			serviceId?: boolean;
		};
	} = $props();

	let form = initForm({
		form: clientServiceForm,
		schema: clientServiceFormSchema,
		opts: formOpts
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
	action={route('default /[orgLabel]/clients/[clientId=uuid]/services/[action=crud]', {
		action,
		orgLabel: user.properties.orgLabel,
		clientId: $formData.clientId
	})}
>
	{#snippet title()}
		<span>Attach a Client to a Service</span>
	{/snippet}
	<Field {form} path="clientId" disabled={disabledFields?.clientId} lookups={lookups.clients}>
		<Label label="Client"></Label>
		<InputLookup onkeydown={() => debouncer.search()} apiRoute={route('GET /api/v1/clients')} />
		<LookupDropdown />
		<Errors />
	</Field>
	<Field {form} path="serviceId" disabled={disabledFields?.serviceId} lookups={lookups.services}>
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
