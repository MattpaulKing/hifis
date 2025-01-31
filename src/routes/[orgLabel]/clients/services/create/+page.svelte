<script lang="ts">
	import { Debouncer } from '$lib/api';
	import { getDrawerStore } from '$lib/components/drawer';
	import {
		Errors,
		Field,
		FormBtns,
		FormCard,
		FormContainer,
		getFormMsgStore,
		initClientForm,
		InputLookup,
		InputTextArea,
		Label,
		LookupDropdown
	} from '$lib/components/forms';
	import { route } from '$lib/ROUTES';
	import { clientsServicesFormSchema } from '../schema';

	let { data } = $props();
	let form = initClientForm({
		form: data.clientServiceForm,
		schema: clientsServicesFormSchema,
		opts: {
			resetForm: true,
			onUpdate({ form, result }) {}
		}
	});

	let { form: formData } = form;
	let possibleDuplicates = $state([]);
	let debouncer = new Debouncer({ callback: fetchDuplicates });
	let msgStore = getFormMsgStore();
	let drawerStore = getDrawerStore();

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

<FormCard drawerOpen={drawerStore.isOpen}>
	<FormContainer
		class="w-full max-w-lg"
		{form}
		action={route('create /[orgLabel]/services/categories/create', { orgLabel: data.org.label })}
	>
		{#snippet title()}
			<span>Add a Service Category</span>
		{/snippet}
		<Field
			{form}
			path="clientId"
			disabled={!!data.lookups.client.inputValue}
			lookupCtx={data.lookups.client}
		>
			<Label label="Client"></Label>
			<InputLookup onKeydown={() => debouncer.search()} apiRoute={route('GET /api/v1/clients')} />
			<LookupDropdown />
			<Errors />
		</Field>
		<Field
			{form}
			path="serviceId"
			disabled={!!data.lookups.service.inputValue}
			lookupCtx={data.lookups.service}
		>
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
</FormCard>
