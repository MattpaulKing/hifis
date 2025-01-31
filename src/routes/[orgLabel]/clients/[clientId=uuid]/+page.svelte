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
		FormCard,
		initForm
	} from '$lib/components/forms';
	import ClientsKeepAdding from '$routes/[orgLabel]/clients/lib/ClientsAddMoreDialog.svelte';
	import { getModalStore } from '$lib/components/modal/context.js';
	import { Step, Stepper, StepperStore } from '$lib/components/stepper';
	import { route } from '$lib/ROUTES';
	import { clientsFormSchema } from '../schema/index.js';
	import { page } from '$app/state';

	let { data } = $props();
	data.client.clientContactForm.data = data.client.contact;
	let form = initForm({
		form: data.client.clientContactForm,
		schema: clientsFormSchema,
		opts: {
			onUpdate({ form }) {
				if (form.valid) {
					modalStore.add({
						id: 'clients-create',
						type: 'component',
						ref: ClientsKeepAdding,
						props: () => ({ orgLabel: data.org.label, clientId: form.data.id }),
						routes: { from: page.url.toString(), to: page.url.toString() }
					});
				}
			}
		}
	});

	let { form: formData } = form;
	let stepperStore = new StepperStore({
		activeIdx: parseInt(page.url.searchParams.get('i') ?? '0'),
		pages: [
			{
				label: 'contact',
				href: route('/[orgLabel]/clients/[clientId=uuid]', {
					orgLabel: data.org.label,
					clientId: data.client.contact.id
				}).concat('?i=0')
			},
			{
				label: 'services',
				href: route('/[orgLabel]/clients/[clientId=uuid]', {
					orgLabel: data.org.label,
					clientId: data.client.contact.id
				}).concat('?i=1')
			}
		],
		expanded: true
	});
	let possibleDuplicates = $state([]);
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
</script>

<FormCard>
	<Stepper title="Details" {stepperStore}>
		{#each stepperStore.pages as page, idx}
			<Step {stepperStore} {idx} {page}>
				{#if stepperStore.expanded}
					{page.label}
				{:else}
					{idx + 1}
				{/if}
			</Step>
		{/each}
	</Stepper>
	{#if stepperStore.activePage.label === 'contact'}
		<FormContainer
			class="min-w-96 max-w-lg"
			{form}
			action={route('default /[orgLabel]/clients/create', { orgLabel: data.org.label })}
		>
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
	{/if}
</FormCard>
