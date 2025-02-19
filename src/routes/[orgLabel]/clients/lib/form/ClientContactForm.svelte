<script lang="ts">
	import { Debouncer } from '$lib/api';
	import {
		Errors,
		Field,
		Input,
		InputDate,
		Label,
		getFormMsgStore,
		FormBtns,
		FormContainer,
		initForm,
		type FormMode
	} from '$lib/components/forms';
	import ClientsKeepAdding from '$routes/[orgLabel]/clients/lib/ClientsAddMoreDialog.svelte';
	import { getModalStore } from '$lib/components/modal/context.js';
	import { route } from '$lib/ROUTES';
	import { page } from '$app/state';
	import { getUser } from '$lib/components/user';
	import { clientContactFormSchema } from '../../schema';
	import type { FormValidated } from '$lib/interfaces';
	import type { Lookup } from '$lib/interfaces/Lookup';

	let {
		clientContactForm,
		action
	}: { clientContactForm: FormValidated<typeof clientContactFormSchema>; action: FormMode } =
		$props();
	let user = getUser();
	let form = initForm({
		form: clientContactForm,
		schema: clientContactFormSchema,
		opts: {
			onUpdate({ form }) {
				if (form.valid && action === 'create') {
					modalStore.add({
						id: 'clients-create',
						type: 'component',
						ref: ClientsKeepAdding,
						props: () => ({ orgLabel: user.properties.orgLabel, clientId: form.data.id }),
						routes: { from: page.url.toString(), to: page.url.toString() }
					});
				}
			}
		}
	});

	let { form: formData } = form;
	let possibleDuplicates = $state<Lookup[]>([]);
	let debouncer = new Debouncer({ callback: fetchDuplicates });
	let msgStore = getFormMsgStore();
	let modalStore = getModalStore();

	async function fetchDuplicates() {
		if (!$formData.firstName || !$formData.lastName) return;
		possibleDuplicates = await fetch(
			`${route('GET /api/v1/clients')}?search=${$formData.firstName} ${$formData.lastName}&lookups=true`
		).then(async (r) => await r.json());
		if (possibleDuplicates.length > 0) {
			msgStore.setMsg({ msg: 'There may be duplicates', status: 'error' });
		}
	}

	let formAction =
		action === 'create'
			? route('default /[orgLabel]/clients/[action=crud]', {
					action,
					orgLabel: user.properties.orgLabel
				})
			: action === 'update'
				? route('update /[orgLabel]/clients/[clientId=uuid]', {
						orgLabel: user.properties.orgLabel,
						clientId: clientContactForm.data.id
					})
				: '';
</script>

<FormContainer class="min-w-96 max-w-lg" {form} action={formAction}>
	{#snippet title()}
		<span class="w-fit"> Client Profile </span>
	{/snippet}
	<Field {form} path="firstName">
		<Label label="First Name" />
		<Input type="text" />
		<Errors />
	</Field>
	<Field {form} path="lastName">
		<Label label="Last Name" />
		<Input type="text" onkeydown={() => debouncer.search()} />
		<Errors />
	</Field>
	<Field {form} path="dob">
		<Label label="Date of Birth" />
		<InputDate {form} />
		<Errors />
	</Field>
	<Field {form} path="phone">
		<Label label="Phone" />
		<Input type="tel" />
		<Errors />
	</Field>
	<Field {form} path="email">
		<Label label="Email" />
		<Input type="email" />
		<Errors />
	</Field>
	<FormBtns></FormBtns>
</FormContainer>
