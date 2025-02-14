<script lang="ts">
	import { FormCard } from '$lib/components/forms';
	import { Step, Stepper, StepperStore } from '$lib/components/stepper';
	import { GridItemTabs, GridItemTabsState } from '$lib/components/user-grid';
	import { lookupCtxDefault, lookupCtxFromSingle } from '$lib/interfaces/lookups';
	import { LogForm } from '$routes/[orgLabel]/logs/lib';
	import { LookupStore } from '$src/lib/components/forms/inputs/LookupStore.svelte';
	import { ClientContactForm, ClientServicesPanel } from '../lib';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	let stepperStore = new StepperStore({
		labels: ['contact', 'services', 'logs'],
		searchKey: 'i',
		expanded: true
	});
	console.dir(data, { depth: null });

	let clientServicesFormLookups = $state({
		clients: new LookupStore(lookupCtxFromSingle(data.client.contact)),
		services: new LookupStore({
			...lookupCtxDefault(),
			excludedIds: Object.keys(data.client.services)
		})
	});

	let logsTabState = new GridItemTabsState({
		entities: Object.values(data.client.logs).map(({ id, createdAt }, i) => ({
			id,
			label: createdAt.toLocaleString(),
			active: i === 0
		})),
		entityLabel: 'log'
	});
	let clientsLogs = $state(data.client.logs);
	let activeLog = $derived.by(() => {
		if (logsTabState.entities[logsTabState.activeIdx].id.length === 0) {
			return null;
		} else {
			return clientsLogs[logsTabState.entities[logsTabState.activeIdx].id];
		}
	});

	let clientLogsFormLookups = $state({
		clients: new LookupStore({ ...lookupCtxFromSingle(data.client.contact), inputValue: '' }),
		services: new LookupStore(lookupCtxDefault())
	});

	//TODO: Have a tab with all entities of StepPage type and clicking within the list adds them to the tab
</script>

<FormCard>
	{#snippet stepper()}
		<Stepper title="Client" {stepperStore}>
			{#each stepperStore.pages as page, idx}
				<Step {stepperStore} {idx} {page}>
					{stepperStore.expanded ? page.label : idx + 1}
				</Step>
			{/each}
		</Stepper>
	{/snippet}
	{#if stepperStore.activePage.label === 'contact'}
		<ClientContactForm clientContactForm={data.client.contactForm} mode="update"
		></ClientContactForm>
	{:else if stepperStore.activePage.label === 'services'}
		<ClientServicesPanel
			clientServicesData={data.client.services}
			clientServiceEventsData={data.client.serviceEvents}
			clientServiceForm={data.client.serviceForm}
			{clientServicesFormLookups}
		></ClientServicesPanel>
	{:else if stepperStore.activePage.label === 'logs' && activeLog}
		<GridItemTabs tabState={logsTabState} />
		<div in:fade={{ duration: 700 }} class="grid grid-cols-3 bg-inherit p-4">
			<span class="col-span-2 text-lg font-bold">
				{activeLog.clients.map(({ label }) => label).join(', ')}
			</span>
			<span class="col-start-3 row-start-1">
				{activeLog.createdAt.toLocaleString()}
			</span>
			<span class="row-start-2">
				{activeLog.services.map(({ label }) => label).join(', ')}
			</span>
			<span class="row-start-3 mt-2">{activeLog.note}</span>
		</div>
	{:else if stepperStore.activePage.label === 'logs' && !activeLog}
		<LogForm logForm={data.client.logForm} mode="create" lookups={clientLogsFormLookups}></LogForm>
	{/if}
</FormCard>
