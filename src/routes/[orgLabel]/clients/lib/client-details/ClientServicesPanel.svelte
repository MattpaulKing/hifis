<script lang="ts">
	import { fade } from 'svelte/transition';
	import { default as ClientServicesFormPage } from '$routes/[orgLabel]/clients/[clientId=uuid]/services/[action=crud]/+page.svelte';
	import { default as ClientServiceEventsFormPage } from '$routes/[orgLabel]/services/events/clients/[action=crud]/+page.svelte';
	import { GridItemTabs, GridItemTabsState } from '$src/lib/components/user-grid';
	import { PanelList, PanelListModalBtn, PanelListBtn } from '$src/lib/components/panels';
	import { retryExp } from '$src/lib/api';
	import { route } from '$src/lib/ROUTES';
	import { getUser } from '$src/lib/components/user';
	import { getModalStore } from '$src/lib/components/modal';
	import { serviceEvents } from '$src/schemas';
	import { ServiceReferralForm } from '$routes/[orgLabel]/services/[serviceId=uuid]/referrals/lib';
	import type { FormValidated } from '$src/lib/interfaces';
	import type { LookupStore } from '$src/lib/components/forms/inputs/LookupStore.svelte';
	import type { ClientServicesApiResponse } from '$routes/api/v1/clients/services/+server';
	import type { servicesReferralsFormSchema } from '$routes/[orgLabel]/services/[serviceId=uuid]/referrals/schema';

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
		serviceReferralForm: FormValidated<typeof servicesReferralsFormSchema>;
		clientServicesFormLookups: {
			clients: LookupStore;
			services: LookupStore;
		};
		clientServiceEventsData: Record<string, (typeof serviceEvents.$inferSelect)[] | undefined>;
	};
	let {
		clientServicesData,
		serviceReferralForm,
		clientServicesFormLookups,
		clientServiceEventsData
	}: Props = $props();
	let user = getUser();
	let modalStore = getModalStore();
	let serviceTabState = new GridItemTabsState({
		entities: [{ id: 'all', label: 'All Services', active: true, tabType: 'entity-list' }],
		entityLabel: 'service'
	});
	let clientServices = $state(clientServicesData);
	let clientServiceEvents = $state(clientServiceEventsData);
	let activeService = $derived.by(() => {
		if (!serviceTabState.activeEntity?.id || !(serviceTabState.activeEntity.id in clientServices))
			return null;
		return {
			...clientServices[serviceTabState.activeEntity.id],
			serviceEvents: clientServiceEvents[serviceTabState.activeEntity.id] ?? []
		};
	});
	async function pushClientsService({ serviceId }: { serviceId: string }) {
		let [clientAndService] = await retryExp<ClientServicesApiResponse[0]>({
			route: `${route('GET /api/v1/clients/services')}?clientId=${serviceReferralForm.data.clientId}&serviceId=${serviceId}`
		});
		if (modalStore.showing) modalStore.close();
		if (!clientAndService) return null;
		clientServices[serviceId] = {
			...clientServices[serviceId],
			...clientAndService.services[0]
		};
		serviceTabState.entities[serviceTabState.activeIdx] = {
			id: serviceId,
			label: clientServices[serviceId].label,
			active: true,
			tabType: 'entity'
		};
	}
	function editServiceRoute(serviceId: string) {
		return `${route('/[orgLabel]/clients/[clientId=uuid]/services/[action=crud]', {
			action: 'update',
			clientId: serviceReferralForm.data.clientId,
			orgLabel: user.properties.orgLabel
		})}?clientId=${serviceReferralForm.data.clientId}&serviceId=${serviceId}`;
	}
	function addServiceEventRoute(serviceId: string) {
		return `${route('/[orgLabel]/services/events/clients/[action=crud]', {
			orgLabel: user.properties.orgLabel,
			action: 'create'
		})}?clientId=${serviceReferralForm.data.clientId}&serviceId=${serviceId}`;
	}
</script>

<GridItemTabs tabState={serviceTabState} />
{#if serviceTabState.activeEntity?.id === 'all'}
	<PanelList listItems={Object.values(clientServices)}>
		{#snippet listItem({ item: service })}
			<PanelListBtn
				disabled={serviceTabState.findIdx(service.id) >= 0}
				onclick={() => serviceTabState.openTab(service)}
			>
				<span class="font-bold"> {service.label}</span>
				<span class="text-surface-800-100-token justify-self-end text-sm">{service.orgLabel}</span>
				<span class="col-span-2 justify-self-start">{service.clientServiceDescription}</span>
			</PanelListBtn>
		{/snippet}
	</PanelList>
{:else if activeService}
	<div
		in:fade={{ duration: 700 }}
		class="grid w-full grid-cols-[minmax(min,1fr)_minmax(120px,min)] gap-x-4 bg-inherit p-4"
	>
		<span class="text-xl font-bold">
			{activeService.label}
		</span>
		<PanelListModalBtn
			class="variant-outline-surface hover:variant-filled"
			href={editServiceRoute(activeService.id)}
			ref={ClientServicesFormPage}
			onCreate={async (response) => {
				if (response?.type === 'save') {
					pushClientsService({ serviceId: activeService.id });
				}
			}}
		>
			<img src="/NotePencil.png" class="hover:filter-none dark:invert" alt="edit" />
		</PanelListModalBtn>
		<span class="">{activeService.categoryLabel}</span>
		<span class="col-span-2 mt-4">{activeService.clientServiceDescription ?? 'No description'}</span
		>
		<hr class="col-span-2 my-2" />
		<span class="mt-4 font-bold">Upcoming Appointments</span>
		<PanelListModalBtn
			class="variant-outline-success hover:variant-filled-success"
			href={addServiceEventRoute(activeService.id)}
			ref={ClientServiceEventsFormPage}
			onCreate={async (response) => {
				if (response?.type === 'save') {
					let res = await fetch(
						`${route('GET /api/v1/services/events')}?serviceId=${activeService.id}&clientId=${serviceReferralForm.data.clientId}`
					).then(async (r) => (await r.json()) as (typeof serviceEvents.$inferSelect)[]);
					clientServiceEvents[activeService.id] = [
						...res.map((serviceEvent) => ({
							...serviceEvent,
							startTS: new Date(serviceEvent.startTS),
							endTS: new Date(serviceEvent.endTS)
						}))
					];
				}
				modalStore.close();
			}}
		>
			<img src="/Plus.png" class="h-5 w-5 p-1 group-hover:filter-none dark:invert" alt="add" />
		</PanelListModalBtn>
		<div class="col-span-2 mt-4 grid h-fit w-full grid-cols-2">
			{#each activeService.serviceEvents as serviceEvent}
				<span class="">{serviceEvent.label}</span>
				<span
					>{serviceEvent.startTS.toLocaleTimeString()} - {serviceEvent.endTS.toLocaleTimeString()}</span
				>
				<span class="col-span-2">{serviceEvent.description}</span>
				<hr class="col-span-2 mb-4 mt-2" />
			{/each}
			{#if activeService.serviceEvents.length === 0}
				<span class="col-span-2">No upcoming events found...</span>
			{/if}
		</div>
	</div>
{:else}
	<ServiceReferralForm
		{serviceReferralForm}
		action="create"
		clientServiceRelation="attach"
		formOpts={{
			async onUpdate({ form }) {
				if (!form.valid) return;
				await pushClientsService({ serviceId: form.data.serviceId });
			}
		}}
		lookups={clientServicesFormLookups}
		disabledFields={{ clientId: true }}
	></ServiceReferralForm>
{/if}
