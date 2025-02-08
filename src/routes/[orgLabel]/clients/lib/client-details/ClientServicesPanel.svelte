<script lang="ts">
	import { fade } from 'svelte/transition';
	import { GridItemTabs, GridItemTabsState } from '$src/lib/components/user-grid';
	import { ClientServiceForm } from '../../[clientId=uuid]/services/lib';
	import { retryExp } from '$src/lib/api';
	import { route } from '$src/lib/ROUTES';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getFormMsgStore } from '$src/lib/components/forms';
	import type { FormValidated } from '$src/lib/interfaces';
	import type { clientServiceFormSchema } from '../../[clientId=uuid]/services/schema';
	import type { LookupStore } from '$src/lib/components/forms/inputs/LookupStore.svelte';
	import type { ServicesApiResponse } from '$routes/api/v1/services/+server';

	type Props = {
		clientServicesData: Record<
			string,
			{
				id: string;
				label: string;
				categoryLabel: string;
				orgLabel: string;
				clientServiceDescription: string;
			}
		>;
		clientServiceForm: FormValidated<typeof clientServiceFormSchema>;
		clientServicesFormLookups: {
			clients: LookupStore;
			services: LookupStore;
		};
	};
	let formMsgStore = getFormMsgStore();
	let { clientServicesData, clientServiceForm, clientServicesFormLookups }: Props = $props();
	let serviceTabState = new GridItemTabsState({
		entities: Object.values(clientServicesData).map(({ id, label }, i) => ({
			id,
			label,
			active: i === 0
		})),
		entityLabel: 'service'
	});
	let clientServices = $state(clientServicesData);
	let activeService = $derived.by(() => {
		if (!serviceTabState.activeEntity?.id) return null;
		return clientServices[serviceTabState.activeEntity.id];
	});
	async function pushClientsService({
		form
	}: {
		form: FormValidated<typeof clientServiceFormSchema>;
	}) {
		let [service] = await retryExp<ServicesApiResponse>({
			route: `${route('GET /api/v1/services')}?id=${form.data.serviceId}`
		});
		if (!service)
			return await goto(page.url, {
				invalidateAll: true,
				replaceState: true,
				noScroll: true
			});
		clientServices[service.id] = {
			...service,
			clientServiceDescription: form.data.description
		};
		serviceTabState.entities[serviceTabState.activeIdx] = {
			id: form.data.serviceId,
			label: service.label,
			active: true,
			tabType: 'entity'
		};
	}
	//TODO: Add ability to have sub pages for Stepper
</script>

{#key clientServices}
	<GridItemTabs tabState={serviceTabState} />
	{#if activeService}
		<div in:fade={{ duration: 700 }} class="grid grid-cols-3 bg-inherit p-4">
			<span class="col-span-2 text-lg font-bold">
				{activeService.label}
			</span>
			<span class="col-start-3 row-start-1">{activeService.orgLabel}</span>
			<span class="row-start-2">{activeService.categoryLabel}</span>
			<span class="row-start-3 mt-2"
				>{activeService.clientServiceDescription ?? 'No description'}</span
			>
		</div>
	{:else}
		<ClientServiceForm
			{clientServiceForm}
			formOpts={{
				async onUpdate({ form }) {
					if (!form.valid) return;
					await pushClientsService({ form });
					formMsgStore.clear();
				}
			}}
			lookups={clientServicesFormLookups}
			disabledFields={{ clientId: true }}
		></ClientServiceForm>
	{/if}
{/key}
