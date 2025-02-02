<script lang="ts">
	import { FormCard } from '$lib/components/forms';
	import { Step, Stepper, StepperStore } from '$lib/components/stepper';
	import { GridItemTabs, GridItemTabsState } from '$lib/components/user-grid';
	import { lookupCtxDefault, lookupCtxFromSingle } from '$lib/interfaces/lookups';
	import { ClientContactForm } from '../lib';
	import { ClientsServicesForm } from '../services/lib';

	let { data } = $props();

	let stepperStore = new StepperStore({
		labels: ['contact', 'services'],
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
	$inspect(activeService);
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
				<span>{activeService.orgLabel}</span>
				<span>{activeService.categoryLabel}</span>
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
	{/if}
</FormCard>
