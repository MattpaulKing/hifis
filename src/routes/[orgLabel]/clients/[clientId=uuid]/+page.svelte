<script lang="ts">
	import { FormCard, getFormMsgStore } from '$lib/components/forms';
	import { Step, Stepper, StepperStore } from '$lib/components/stepper';
	import { GridItemTabs, GridItemTabsState } from '$lib/components/user-grid';
	import { lookupCtxDefault, lookupCtxFromSingle } from '$lib/interfaces/lookups';
	import { LogForm } from '$routes/[orgLabel]/logs/lib';
	import { LookupStore } from '$src/lib/components/forms/inputs/LookupStore.svelte';
	import { route } from '$src/lib/ROUTES';
	import { ClientContactForm } from '../lib';
	import { ClientsServicesForm } from './services/lib';
	import { services } from '$src/schemas';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { retryExp } from '$src/lib/api';
	import { fade } from 'svelte/transition';
	import type { FormValidated } from '$src/lib/interfaces';
	import type { clientsServicesFormSchema } from './services/schema';

	let { data } = $props();
	let stepperStore = new StepperStore({
		labels: ['contact', 'services', 'logs'],
		searchKey: 'i',
		expanded: true
	});
	let serviceTabState = new GridItemTabsState({
		entities: Object.values(data.client.services).map(({ id, label }, i) => ({
			id,
			label,
			active: i == 0
		})),
		entityLabel: 'Service'
	});
	let clientsServices = $state(data.client.services);
	let activeService = $derived.by(() => {
		if (serviceTabState.entities[serviceTabState.activeIdx].id.length === 0) {
			return null;
		} else {
			return clientsServices[serviceTabState.entities[serviceTabState.activeIdx].id];
		}
	});
	let clientServicesFormLookups = $state({
		clients: new LookupStore(lookupCtxFromSingle(data.client.contact)),
		services: new LookupStore({
			...lookupCtxDefault(),
			excludedIds: Object.keys(data.client.services)
		})
	});
	async function pushClientsService({
		form
	}: {
		form: FormValidated<typeof clientsServicesFormSchema>;
	}) {
		let service = await retryExp({
			fn: async () => {
				let res = await fetch(`${route('GET /api/v1/services')}?id=${form.data.serviceId}`).then(
					async (r) =>
						(await r.json()) as (typeof services.$inferSelect & {
							categoryLabel: string;
							orgLabel: string;
						})[]
				);
				if (!res || res.length === 0) {
					throw Error('No res');
				}
				return res[0];
			}
		});
		if (!service)
			return await goto(page.url, {
				invalidateAll: true,
				replaceState: true,
				noScroll: true
			});
		clientsServices[service.id] = {
			...service,
			clientsServicesDescription: form.data.description
		};

		serviceTabState.entities[serviceTabState.activeIdx] = {
			id: form.data.serviceId,
			label: service.label,
			active: true
		};
	}

	let logsTabState = new GridItemTabsState({
		entities: Object.values(data.client.logs).map(({ id, createdAt }, i) => ({
			id,
			label: createdAt.toLocaleString(),
			active: i == 0
		})),
		entityLabel: 'Service'
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
	{:else if stepperStore.activePage.label === 'services' && activeService}
		<GridItemTabs tabState={serviceTabState} />
		<div in:fade={{ duration: 700 }} class="grid grid-cols-3 bg-inherit p-4">
			<span class="col-span-2 text-lg font-bold">
				{activeService.label}
			</span>
			<span class="col-start-3 row-start-1">{activeService.orgLabel}</span>
			<span class="row-start-2">{activeService.categoryLabel}</span>
			<span class="row-start-3 mt-2"
				>{activeService.clientsServicesDescription ?? 'No description'}</span
			>
		</div>
	{:else if stepperStore.activePage.label === 'services' && !activeService}
		<GridItemTabs tabState={serviceTabState} />
		<ClientsServicesForm
			clientServiceForm={data.client.serviceForm}
			formOpts={{
				async onUpdate({ form }) {
					if (!form.valid) return;
					await pushClientsService({ form });
					getFormMsgStore().clear();
				}
			}}
			lookups={clientServicesFormLookups}
			disabledFields={{ clientId: true }}
		></ClientsServicesForm>
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
