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
	import { getUser } from '$lib/components/user';
	import { servicesReferralsFormSchema } from '../../schema';
	import type { LookupStore } from '$src/lib/components/forms/inputs/LookupStore.svelte';
	import type { CRUD } from '$src/params/crud';
	import type { FormValidated, FormOpts } from '$src/lib/interfaces';

	let {
		serviceReferralForm,
		action,
		clientServiceRelation,
		formOpts,
		lookups = $bindable(),
		disabledFields
	}: {
		serviceReferralForm: FormValidated<typeof servicesReferralsFormSchema>;
		action: CRUD;
		clientServiceRelation: 'attach' | 'referral';
		formOpts?: FormOpts<typeof servicesReferralsFormSchema>;
		lookups: {
			clients: LookupStore;
			services: LookupStore;
			statuses: LookupStore;
		};
		disabledFields?: {
			[K in keyof typeof serviceReferralForm.data]: boolean;
		};
	} = $props();

	let form = initForm({
		form: serviceReferralForm,
		schema: servicesReferralsFormSchema,
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
	let formAction =
		clientServiceRelation === 'referral'
			? route('default /[orgLabel]/services/[serviceId=uuid]/referrals/[action=crud]', {
					action,
					orgLabel: user.properties.orgLabel,
					serviceId: $formData.serviceId
				})
			: route('default /[orgLabel]/clients/[clientId=uuid]/services/[action=crud]', {
					orgLabel: user.properties.orgLabel,
					clientId: $formData.clientId,
					action: 'create'
				});
</script>

<FormContainer {form} action={formAction}>
	{#snippet title()}
		<span>Refer a Client to a Service</span>
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
		<Label label="Description">
			{#snippet fieldDescription()}
				<span class="-mt-1 text-surface-400"
					>Explain why the service is a good fit for the referral</span
				>
			{/snippet}
		</Label>
		<InputTextArea />
		<Errors />
	</Field>
	<FormBtns></FormBtns>
</FormContainer>
