<script lang="ts">
	import { FormCard, LookupStore } from '$src/lib/components/forms';
	import { Step, Stepper, StepperStore } from '$src/lib/components/stepper';
	import { lookupCtxFromSingle } from '$src/lib/interfaces/lookups';
	import { ServiceClientsPanel, ServiceContactForm, ServiceEventsPanel } from '../lib';

	let { data } = $props();
	let stepperStore = new StepperStore({
		labels: ['contact', 'clients', 'events', 'referrals'],
		searchKey: 'i',
		expanded: true
	});
	let lookups = {
		serviceCategory: new LookupStore(lookupCtxFromSingle(data.lookups.serviceCategory))
	};
	let clients = $state(data.clients);
	let clientServiceEvents = $state(data.clientsEvents);
	let serviceEvents = $state(data.serviceEvents);
</script>

<FormCard>
	{#snippet stepper()}
		<Stepper label="Service" {stepperStore}>
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
			{clients}
			service={data.service}
			{clientServiceEvents}
			clientContactForm={data.clientContactForm}
			clientServiceForm={data.clientServiceForm}
		></ServiceClientsPanel>
	{:else if stepperStore.activePage.label === 'events'}
		<ServiceEventsPanel bind:serviceEvents serviceEventForm={data.serviceEventForm}
		></ServiceEventsPanel>
	{:else if stepperStore.activePage.label === 'referrals'}
		<div></div>
	{/if}
</FormCard>
