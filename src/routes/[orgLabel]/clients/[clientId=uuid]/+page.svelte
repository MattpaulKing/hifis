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
		entities: data.client.services.map(({ id, label }, i) => ({
			id,
			label,
			active: i == 0
		}))
	});
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
		{#if tabState.activeAdd}
			<ClientsServicesForm
				clientServiceForm={data.client.serviceForm}
				lookups={{
					client: lookupCtxFromSingle(data.client.contact),
					service: {
						...lookupCtxDefault(),
						excludedIds: data.client.services.map(({ id }) => id)
					}
				}}
				disabledFields={{ clientId: true }}
			></ClientsServicesForm>
		{/if}
	{/if}
</FormCard>
