<script lang="ts">
	import { GridItemTabs, GridItemTabsState } from '$src/lib/components/user-grid';
	import { ClientContactForm } from '$routes/[orgLabel]/clients/lib';
	import { default as ClientContactFormPage } from '$routes/[orgLabel]/clients/[action=crud]/+page.svelte';
	import { PanelList, PanelListModalBtn, PanelListBtn } from '$src/lib/components/panels';
	import { timestampsDefault } from '$src/schemas/helpers';
	import { route } from '$src/lib/ROUTES';
	import { getUser } from '$src/lib/components/user';
	import { fade } from 'svelte/transition';
	import { invalidateAll } from '$app/navigation';
	import { getModalStore } from '$src/lib/components/modal';
	import { clientServiceFormSchema } from '$routes/[orgLabel]/clients/[clientId=uuid]/services/schema';
	import {
		Errors,
		Field,
		FormBtns,
		FormContainer,
		initForm,
		InputTextArea,
		Label
	} from '$src/lib/components/forms';
	import type { clients as Clients, serviceEvents, services } from '$src/schemas';
	import type { FormValidated } from '$src/lib/interfaces';
	import type { clientContactFormSchema } from '$routes/[orgLabel]/clients/schema';

	type Props = {
		service: typeof services.$inferSelect;
		clients: Record<
			string,
			typeof Clients.$inferSelect & { clientServiceId: string; clientServiceDescription: string }
		>;
		clientServiceEvents: Record<string, (typeof serviceEvents.$inferSelect)[] | undefined>; // NOTE: clientIds -> serviceEvent map
		clientServiceForm: FormValidated<typeof clientServiceFormSchema>;
		clientContactForm: FormValidated<typeof clientContactFormSchema>;
	};
	let {
		service,
		clients,
		clientServiceEvents,
		clientContactForm,
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
	let modalStore = getModalStore();
	let user = getUser();
	let clientServiceForm = initForm({ form: _clientServiceForm, schema: clientServiceFormSchema });
	let { form: clientServiceFormData } = clientServiceForm;
	function setFormDataToActiveClient() {
		if (!activeClient) return;
		let id = activeClient.id;
		$clientServiceFormData = {
			id: clients[id].clientServiceId,
			clientId: id,
			serviceId: service.id,
			description: clients[id].clientServiceDescription
		};
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
					clientContactForm.data = { ...client };
					$clientServiceFormData = {
						id: client.clientServiceId,
						clientId: client.id,
						serviceId: service.id,
						description: client.clientServiceDescription
					};
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
	<div in:fade={{ duration: 700 }} class="grid w-full grid-cols-[1fr_auto] gap-x-4 bg-inherit p-4">
		<span class="text-xl font-bold">
			{activeClient.label}
		</span>
		<PanelListModalBtn
			class="variant-outline-surface hover:variant-filled"
			href={`${route('/[orgLabel]/clients/[action=crud]', {
				orgLabel: user.properties.orgLabel,
				action: 'update'
			})}?clientId=${activeClient.id}`}
			ref={ClientContactFormPage}
			onCreate={async (response) => {
				if (response?.type === 'save') {
					modalStore.close();
					await invalidateAll();
				}
			}}
		>
			<img src="/NotePencil.png" class="hover:filter-none dark:invert" alt="edit" />
		</PanelListModalBtn>
		<FormContainer
			class="col-span-2"
			form={clientServiceForm}
			action={route('default /[orgLabel]/clients/[clientId=uuid]/services/[action=crud]', {
				orgLabel: user.properties.orgLabel,
				clientId: activeClient.id,
				action: activeClient.clientServiceDescription.length > 0 ? 'update' : 'create'
			})}
		>
			<Field form={clientServiceForm} path="description" class="col-span-2 min-w-96">
				<Label label="Client's Service Description"></Label>
				<InputTextArea></InputTextArea>
				<Errors></Errors>
			</Field>
			<FormBtns></FormBtns>
		</FormContainer>
	</div>
{:else}
	<ClientContactForm
		action="create"
		{clientContactForm}
		opts={{
			onUpdate({ form }) {
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
		}}
	></ClientContactForm>
{/if}
