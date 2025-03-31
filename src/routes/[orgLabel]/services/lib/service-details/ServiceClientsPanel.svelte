<script lang="ts">
	import { GridItemTabs, GridItemTabsState } from '$src/lib/components/user-grid';
	import { ClientContactForm } from '$routes/[orgLabel]/clients/lib';
	import { PanelList, PanelListBtn } from '$src/lib/components/panels';
	import { timestampsDefault } from '$src/schemas/helpers';
	import { fade } from 'svelte/transition';
	import { clientServiceSchema } from '$routes/[orgLabel]/clients/[clientId=uuid]/services/schema';
	import { initForm } from '$src/lib/components/forms';
	import { clientContactSchema} from '$routes/[orgLabel]/clients/schema';
	import type { clients as Clients, serviceEvents, services } from '$src/schemas';
	import type { FormValidated } from '$src/lib/interfaces';

	type Props = {
		service: typeof services.$inferSelect;
		clients: Record<
			string,
			typeof Clients.$inferSelect & { clientServiceId: string; clientServiceDescription: string }
		>;
		clientServiceEvents: Record<string, (typeof serviceEvents.$inferSelect)[] | undefined>; // NOTE: clientIds -> serviceEvent map
		clientServiceForm: FormValidated<typeof clientServiceSchema>;
		clientContactForm: FormValidated<typeof clientContactSchema>;
	};
	let {
		service,
		clients,
		clientServiceEvents,
		clientContactForm: _clientContactForm,
		clientServiceForm: _clientServiceForm
	}: Props = $props();
	let clientTabState = new GridItemTabsState({
		entities: [{ id: 'all', label: 'All Clients', tabType: 'entity-list', active: true }],
		entityLabel: 'Clients'
	});
	let activeClient = $derived.by(() => {
		if (!clientTabState.activeEntity?.id || !(clientTabState.activeEntity.id in clients))
			return null;
		return {
			...clients[clientTabState.activeEntity.id]
		};
	});
	let clientContactForm = initForm({ form: _clientContactForm, schema: clientContactSchema});
	let { form: clientContactFormData } = clientContactForm;
	function setFormDataToActiveClient() {
		if (!activeClient) {
			clientContactForm.reset();
		} else {
			$clientContactFormData = activeClient;
		}
	}
	function updateClients({ form }: { form: typeof _clientContactForm }) {
		if (form.valid) {
			clients[form.data.id] = {
				...form.data,
				...timestampsDefault(),
				label: `${form.data.firstName} ${form.data.lastName}`,
				clientServiceDescription: '',
				clientServiceId: service.id
			};
			clientTabState.entities[clientTabState.activeIdx] = {
				...clientTabState.entities[clientTabState.activeIdx],
				id: form.data.id,
				label: clients[form.data.id].label
			};
		}
	}
</script>

<GridItemTabs
	onclick={setFormDataToActiveClient}
	onClose={setFormDataToActiveClient}
	tabState={clientTabState}
></GridItemTabs>
{#if clientTabState.activeEntity?.id === 'all'}
	<PanelList listItems={Object.values(clients)}>
		{#snippet listItem({ item: client })}
			<PanelListBtn
				disabled={clientTabState.findIdx(client.id) >= 0}
				onclick={() => {
					clientTabState.openTab(client);
					setFormDataToActiveClient();
				}}
			>
				<span class="justify-self-start font-bold">{client.label}</span>
				<span class="justify-self-end">{client.dob.toLocaleDateString()}</span>
				<span class="justify-self-end"
					>Upcoming appointments: {clientServiceEvents[client.id]?.length ?? 0}</span
				>
			</PanelListBtn>
		{/snippet}
	</PanelList>
{:else if activeClient}
	<div in:fade={{ duration: 700 }} class="grid w-full gap-x-4 bg-inherit p-4">
		<ClientContactForm
			action="update"
			{clientContactForm}
			opts={{
				onUpdate({ form }) {
					updateClients({ form });
				}
			}}
		></ClientContactForm>
	</div>
{:else}
	<!-- <ServiceCli -->
	<!-- <ClientContactForm -->
	<!-- 	action="create" -->
	<!-- 	{clientContactForm} -->
	<!-- 	opts={{ -->
	<!-- 		onUpdate({ form }) { -->
	<!-- 			updateClients({ form }); -->
	<!-- 		} -->
	<!-- 	}} -->
	<!-- ></ClientContactForm> -->
{/if}
