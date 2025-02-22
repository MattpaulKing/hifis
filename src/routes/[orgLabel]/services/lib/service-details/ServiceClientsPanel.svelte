<script lang="ts">
	import { GridItemTabs, GridItemTabsState } from '$src/lib/components/user-grid';
	import { ClientContactForm } from '$routes/[orgLabel]/clients/lib';
	import { PanelList, PanelListBtn } from '$src/lib/components/panels';
	import type { clients, serviceEvents } from '$src/schemas';
	import type { FormValidated } from '$src/lib/interfaces';
	import type { clientContactFormSchema } from '$routes/[orgLabel]/clients/schema';

	type Props = {
		servicesClients: Record<
			string,
			typeof clients.$inferSelect & { clientServiceDescription: string }
		>;
		clientServiceEvents: Record<string, (typeof serviceEvents.$inferSelect)[] | undefined>; // NOTE: clientIds -> serviceEvent map
		clientContactForm: FormValidated<typeof clientContactFormSchema>;
	};
	let { servicesClients, clientServiceEvents, clientContactForm }: Props = $props();
	let clientTabState = new GridItemTabsState({
		entities: [{ id: 'all', label: 'All Clients', active: true }],
		entityLabel: 'Clients'
	});
	let activeClient = $derived.by(() => {
		if (!clientTabState.activeEntity?.id || !(clientTabState.activeEntity.id in servicesClients))
			return null;
		return {
			...servicesClients[clientTabState.activeEntity.id]
		};
	});
</script>

<GridItemTabs tabState={clientTabState}></GridItemTabs>
{#if clientTabState.activeEntity?.id === 'all'}
	<PanelList listItems={Object.values(servicesClients)}>
		{#snippet listItem({ item: client })}
			<PanelListBtn
				disabled={clientTabState.findIdx(client.id) >= 0}
				onclick={() => {
					clientTabState.openTab(client);
					clientContactForm.data = { ...client };
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
	<ClientContactForm action="read" {clientContactForm}></ClientContactForm>
{/if}
