<script lang="ts">
	import { PanelList, PanelListBtn, PanelListModalBtn } from '$src/lib/components/panels';
	import { GridItemTabs, GridItemTabsState } from '$src/lib/components/user-grid';
	import { default as ServiceEventFormPage } from '$routes/[orgLabel]/services/events/[action=crud]/+page.svelte';
	import { default as ServiceEventClientFormPage } from '$routes/[orgLabel]/services/events/clients/[action=crud]/+page.svelte';
	import { fmtDate, fmtTime } from '$lib/helpers';
	import { fade } from 'svelte/transition';
	import { route } from '$src/lib/ROUTES';
	import { getUser } from '$src/lib/components/user';
	import { ServiceEventForm } from '$routes/[orgLabel]/services/events/lib';
	import { timestampsDefault } from '$src/schemas/helpers';
	import { ServiceEventClientChip } from '..';
	import { flip } from 'svelte/animate';
	import type { clients, serviceEvents as ServiceEvents } from '$src/schemas';
	import type { FormValidated } from '$src/lib/interfaces';
	import type { serviceEventsSchema } from '../../events/schema';

	type Props = {
		serviceEvents: Record<
			string,
			typeof ServiceEvents.$inferSelect & { attending: Record<string, typeof clients.$inferSelect> }
		>;
		serviceEventForm: FormValidated<typeof serviceEventsSchema>;
	};
	let { serviceEvents = $bindable(), serviceEventForm }: Props = $props();
	let user = getUser();

	let eventTabState = new GridItemTabsState({
		entities: [{ id: 'all', label: 'All Events', tabType: 'entity-list', active: true }],
		entityLabel: 'Events'
	});
	let activeEvent = $derived.by(() => {
		if (eventTabState.entities[eventTabState.activeIdx].id.length === 0) {
			return null;
		} else {
			return serviceEvents[eventTabState.entities[eventTabState.activeIdx].id];
		}
	});
	function activeEventRoute(serviceEventId: string) {
		return `${route('/[orgLabel]/services/events/[action=crud]', {
			orgLabel: user.properties.orgLabel,
			action: 'update'
		})}?serviceEventId=${serviceEventId}`;
	}
	async function pushClientToAttending({ serviceEventId }: { serviceEventId: string }) {
		let attending = await fetch(
			`${route('GET /api/v1/services/events/clients')}?serviceEventId=${serviceEventId}`
		)
			.then(
				async (r) =>
					(await r.json()) as {
						client: typeof clients.$inferSelect;
						serviceEvent: typeof serviceEvents.$inferSelect;
					}[]
			)
			.then((rows) =>
				rows.reduce(
					(agg, row) => {
						if (!(row.client.id in agg)) {
							agg[row.client.id] = row.client;
						}
						return agg;
					},
					{} as Record<string, typeof clients.$inferSelect>
				)
			);
		serviceEvents[eventTabState.entities[eventTabState.activeIdx].id].attending = attending;
	}
	function fadeOnDelete(node: Element) {
		if (deleted) {
			deleted = false;
			return fade(node);
		} else {
			return fade(node, { duration: 0 });
		}
	}
	let deleted = $state(false);
</script>

<GridItemTabs tabState={eventTabState}></GridItemTabs>
{#if eventTabState.activeEntity?.tabType === 'entity-list'}
	<PanelList listItems={Object.values(serviceEvents)}>
		{#snippet listItem({ item: serviceEvent })}
			<PanelListBtn
				disabled={eventTabState.findIdx(serviceEvent.id) >= 0}
				onclick={() => {
					eventTabState.openTab(serviceEvent);
				}}
			>
				<span class="justify-self-start font-bold">{serviceEvent.label}</span>
				<span class="justify-self-end"
					>Registered: {Object.keys(serviceEvent.attending).length} / {serviceEvent.spaces}</span
				>
				<div class="col-span-2 flex w-full justify-between gap-x-2 justify-self-start">
					<span>{fmtDate(serviceEvent.startTS)} {fmtTime(serviceEvent.startTS)}</span>
					<span>-</span>
					<span>{fmtDate(serviceEvent.endTS, { year: true })} {fmtTime(serviceEvent.endTS)}</span>
				</div>
				<span></span>
			</PanelListBtn>
		{/snippet}
	</PanelList>
{:else if eventTabState.activeEntity?.tabType === 'new-entity'}
	<ServiceEventForm
		action="create"
		{serviceEventForm}
		opts={{
			onUpdate({ form }) {
				if (form.valid) {
					serviceEvents[form.data.id] = { ...form.data, ...timestampsDefault(), attending: {} };
					eventTabState.entities[eventTabState.activeIdx] = {
						...eventTabState.entities[eventTabState.activeIdx],
						label: form.data.label,
						id: form.data.id,
						tabType: 'entity'
					};
				}
			}
		}}
	></ServiceEventForm>
{:else if activeEvent}
	<div
		in:fade={{ delay: 0, duration: 700 }}
		class="grid w-full grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 bg-inherit p-4"
	>
		<span class="text-xl font-bold">
			{activeEvent.label}
		</span>
		<PanelListModalBtn
			href={`${route('/[orgLabel]/services/events/[action=crud]', {
				orgLabel: user.properties.orgLabel,
				action: 'update'
			})}?serviceEventId=${activeEvent.id}`}
			ref={ServiceEventFormPage}
		>
			<img src="/NotePencil.png" class="p-1 group-hover:filter-none dark:invert" alt="update" />
		</PanelListModalBtn>
		<div class="col-span-2 flex gap-x-2">
			<span class=""
				>{activeEvent.startTS.toLocaleDateString()} {fmtTime(activeEvent.startTS)} -</span
			>
			<span class="">{activeEvent.endTS.toLocaleDateString()} {fmtTime(activeEvent.endTS)} </span>
		</div>
		<hr class="col-span-2 mt-2" />
		<div class="col-span-2 flex w-full flex-col gap-x-4 bg-inherit">
			<div class="flex justify-between">
				<span class="mb-2 font-bold">Clients Attending</span>
				<PanelListModalBtn
					class="variant-ghost btn btn-sm hover:variant-filled-success"
					href={`${route('/[orgLabel]/services/events/clients/[action=crud]', {
						orgLabel: user.properties.orgLabel,
						action: 'create'
					})}?serviceEventId=${activeEvent.id}&serviceId=${activeEvent.serviceId}`}
					ref={ServiceEventClientFormPage}
					onCreate={async (response) => {
						if (response?.type === 'save') {
							pushClientToAttending({ serviceEventId: activeEvent.id });
						}
					}}>+</PanelListModalBtn
				>
			</div>
			<ul class="grid w-fit grid-cols-[auto_auto] justify-items-stretch gap-2 overflow-y-auto">
				{#if Object.values(activeEvent.attending).length === 0}
					<li>
						<span class="mx-4">None found...</span>
					</li>
				{:else}
					{#each Object.values(activeEvent.attending) as clientAttending, i (i)}
						<li animate:flip out:fadeOnDelete>
							<ServiceEventClientChip
								clientId={clientAttending.id}
								clientLabel={clientAttending.label}
								serviceEventId={activeEvent.id}
								onDelete={() => {
									deleted = true;
									delete serviceEvents[activeEvent.id].attending[clientAttending.id];
								}}
							></ServiceEventClientChip>
						</li>
					{/each}
				{/if}
			</ul>
		</div>
	</div>
{/if}
