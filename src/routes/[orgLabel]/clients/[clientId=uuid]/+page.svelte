<script lang="ts">
	import { FormCard, initForm } from '$lib/components/forms';
	import { Step, Stepper, StepperStore } from '$lib/components/stepper';
	import { lookupCtxDefault, lookupCtxFromSingle } from '$lib/interfaces/lookups';
	import { LookupStore } from '$src/lib/components/forms/inputs/LookupStore.svelte';
	import { ClientContactForm, ClientLogsPanel, ClientServicesPanel } from '../lib';
	import { clientContactSchema} from '../schema';

	let { data } = $props();
	let stepperStore = new StepperStore({
		labels: ['contact', 'services', 'logs'],
		searchKey: 'i',
		expanded: true
	});
	let clientServicesFormLookups = $state({
		clients: new LookupStore(lookupCtxFromSingle(data.client.contact)),
		services: new LookupStore({
			...lookupCtxDefault(),
			excludedIds: Object.keys(data.client.services)
		})
	});
	let clientContactForm = initForm({
		form: data.client.contactForm,
		schema: clientContactSchema
	});
</script>

<FormCard>
	{#snippet stepper()}
		<Stepper label="Client" subLabel={data.client.contact.label} {stepperStore}>
			{#each stepperStore.pages as page, idx}
				<Step {stepperStore} {idx} {page}>
					{stepperStore.expanded ? page.label : idx + 1}
				</Step>
			{/each}
		</Stepper>
	{/snippet}
	{#if stepperStore.activePage.label === 'contact'}
		<ClientContactForm action="update" {clientContactForm}></ClientContactForm>
	{:else if stepperStore.activePage.label === 'services'}
		<ClientServicesPanel
			clientServicesData={data.client.services}
			clientServiceEventsData={data.client.serviceEvents}
			serviceReferralForm={data.client.serviceReferralForm}
			{clientServicesFormLookups}
		></ClientServicesPanel>
	{:else if stepperStore.activePage.label === 'logs'}
		<ClientLogsPanel
			logForm={data.client.logForm}
			clientLogs={data.client.logs}
			clientContact={data.client.contact}
		></ClientLogsPanel>
	{/if}
</FormCard>
