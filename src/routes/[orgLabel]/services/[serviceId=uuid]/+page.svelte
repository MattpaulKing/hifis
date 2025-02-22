<script lang="ts">
	import { FormCard, LookupStore } from '$src/lib/components/forms';
	import { Step, Stepper, StepperStore } from '$src/lib/components/stepper';
	import { lookupCtxFromSingle } from '$src/lib/interfaces/lookups';
	import { ServiceClientsPanel, ServiceContactForm } from '../lib';

	let { data } = $props();
	let stepperStore = new StepperStore({
		labels: ['contact', 'clients', 'events'],
		searchKey: 'i',
		expanded: true
	});
	let lookups = {
		serviceCategory: new LookupStore(lookupCtxFromSingle(data.lookups.serviceCategory))
	};
	let servicesClients = $state(data.clients);
	let clientServiceEvents = $state(data.clientsEvents);
</script>

<FormCard>
	{#snippet stepper()}
		<Stepper title="Service" {stepperStore}>
			{#each stepperStore.pages as page, idx}
				<Step {stepperStore} {idx} {page}>
					{stepperStore.expanded ? page.label : idx + 1}
				</Step>
			{/each}
		</Stepper>
	{/snippet}
	{#if stepperStore.activePage.label === 'contact'}
		<ServiceContactForm action="update" serviceForm={data.serviceForm} {lookups}
		></ServiceContactForm>
	{:else if stepperStore.activePage.label === 'clients'}
		<ServiceClientsPanel
			{servicesClients}
			{clientServiceEvents}
			clientContactForm={data.clientContactForm}
		></ServiceClientsPanel>
	{:else if stepperStore.activePage.label === 'events'}
		<div></div>
	{/if}
</FormCard>
