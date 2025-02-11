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
	import type { serviceEvents } from '$src/schemas';
	import { getUser } from '$src/lib/components/user';
	import { getModalStore, openModal } from '$src/lib/components/modal';

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
		clientServicesEvents: Record<string, (typeof serviceEvents.$inferSelect)[]>;
	};
	let {
		clientServicesData,
		clientServiceForm,
		clientServicesFormLookups,
		clientServicesEvents
	}: Props = $props();
	let formMsgStore = getFormMsgStore();
	let user = getUser();
	let modalStore = getModalStore();
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
		return {
			...clientServices[serviceTabState.activeEntity.id],
			serviceEvents: clientServicesEvents[serviceTabState.activeEntity.id]
		};
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
</script>

<GridItemTabs tabState={serviceTabState} />
{#if activeService}
	<div in:fade={{ duration: 700 }} class="grid w-fit grid-cols-[auto_1fr] gap-x-4 bg-inherit p-4">
		<span class="text-lg font-bold">
			{activeService.label}
		</span>
		<span class="justify-self-end text-right">{activeService.orgLabel}</span>
		<span class="col-span-2">{activeService.categoryLabel}</span>
		<span class="col-span-2 mt-2">{activeService.clientServiceDescription ?? 'No description'}</span
		>
		<span class="mt-4">Upcoming Appointments</span>
		<a
			onclick={(e) => {
				e.preventDefault();
				openModal({
					routes: {
						from: page.url.toString(),
						to: route('/[orgLabel]/clients/[clientId=uuid]/services/create', {
							clientId: clientServiceForm.data.clientId,
							orgLabel: user.properties.orgLabel
						})
					},
					ref: '',
					modalStore
				});
			}}
			href={route('/[orgLabel]/clients/[clientId=uuid]/services/create', {
				clientId: clientServiceForm.data.clientId,
				orgLabel: user.properties.orgLabel
			})}
			class="variant-ghost border-success-300-600-token btn btn-sm h-min w-min
      place-self-end justify-self-end border transition-colors hover:variant-filled-success">Add</a
		>
		<div class="col-span-2 mt-4 grid h-fit w-full grid-cols-2">
			{#each activeService.serviceEvents as serviceEvent}
				<span class="">{serviceEvent.label}</span>
				<span
					>{serviceEvent.startTS.toLocaleTimeString()} - {serviceEvent.endTS.toLocaleTimeString()}</span
				>
				<span class="col-span-2">{serviceEvent.description}</span>
				<hr class="col-span-2 mb-4 mt-2" />
			{/each}
		</div>
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
