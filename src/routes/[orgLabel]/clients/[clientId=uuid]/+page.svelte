<script lang="ts">
	import { FormCard } from '$lib/components/forms';
	import { Step, Stepper, StepperStore } from '$lib/components/stepper';
	import { GridItemTabs, GridItemTabsState } from '$lib/components/user-grid';
	import { lookupCtxDefault, lookupCtxFromSingle } from '$lib/interfaces/lookups';
	import { LogForm } from '$routes/[orgLabel]/logs/lib';
	import { ClientContactForm } from '../lib';
	import { ClientsServicesForm } from './services/lib';

	let { data } = $props();

	let stepperStore = new StepperStore({
		labels: ['contact', 'services', 'logs'],
		searchKey: 'i',
		expanded: true
	});
	let tabState = new GridItemTabsState({
		entities: Object.values(data.client.services).map(({ id, label }, i) => ({
			id,
			label,
			active: i == 0
		}))
	});
	let activeService = $derived.by(() => {
		return data.client.services[tabState.entities[tabState.activeIdx].id];
	});
	let logsPageState = $state<'create' | 'read'>('create');
</script>

<FormCard>
	{#snippet stepper()}
		<Stepper title="Client" {stepperStore}>
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
	{/snippet}
	{#if stepperStore.activePage.label === 'contact'}
		<ClientContactForm clientContactForm={data.client.contactForm} mode="update"
		></ClientContactForm>
	{:else if stepperStore.activePage.label === 'services'}
		<GridItemTabs {tabState} />
		{#if tabState.activeIdx >= 0}
			<div class="grid grid-cols-3 p-4">
				<span class="col-span-2 text-lg font-bold">
					{activeService.label}
				</span>
				<span class="col-start-3 row-start-1">{activeService.orgLabel}</span>
				<span class="row-start-2">{activeService.categoryLabel}</span>
				<span class="row-start-3 mt-2"
					>{activeService.clientsServicesDescription ?? 'No description'}</span
				>
			</div>
		{:else}
			<ClientsServicesForm
				clientServiceForm={data.client.serviceForm}
				lookups={{
					client: lookupCtxFromSingle(data.client.contact),
					service: {
						...lookupCtxDefault(),
						excludedIds: Object.keys(data.client.services)
					}
				}}
				disabledFields={{ clientId: true }}
			></ClientsServicesForm>
		{/if}
	{:else if stepperStore.activePage.label === 'logs'}
		{#if logsPageState === 'read'}
			<div></div>
		{:else if logsPageState === 'create'}
			<LogForm
				logForm={data.client.logForm}
				mode="create"
				lookups={{
					clients: lookupCtxFromSingle(data.client.contact),
					services: lookupCtxDefault()
				}}
			></LogForm>
		{/if}
	{/if}
</FormCard>
