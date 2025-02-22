<script lang="ts">
	import { lookupCtxDefault, lookupCtxFromSingle } from '$src/lib/interfaces/lookups';
	import { fade } from 'svelte/transition';
	import { GridItemTabs, GridItemTabsState } from '$src/lib/components/user-grid';
	import { LookupStore } from '$src/lib/components/forms';
	import { LogForm, type aggLogsWitsClientsAndServices } from '$routes/[orgLabel]/logs/lib';
	import type { clients } from '$src/schemas';
	import type { FormValidated } from '$src/lib/interfaces';
	import type { logsFormSchema } from '$routes/[orgLabel]/logs/schema';
	import { PanelList, PanelListBtn } from '$src/lib/components/panels';

	type Props = {
		logForm: FormValidated<typeof logsFormSchema>;
		clientLogs: ReturnType<typeof aggLogsWitsClientsAndServices>;
		clientContact: typeof clients.$inferSelect;
	};
	let { logForm, clientLogs, clientContact }: Props = $props();
	let logsTabState = new GridItemTabsState({
		entities: [{ id: 'all', label: 'All Logs', active: true }],
		entityLabel: 'log'
	});
	let activeLog = $derived.by(() => {
		if (logsTabState.entities[logsTabState.activeIdx].id.length === 0) {
			return null;
		} else {
			return clientLogs[logsTabState.entities[logsTabState.activeIdx].id];
		}
	});
	let clientLogsFormLookups = $state({
		clients: new LookupStore({ ...lookupCtxFromSingle(clientContact), inputValue: '' }),
		services: new LookupStore(lookupCtxDefault()),
		categoryId: new LookupStore(lookupCtxDefault())
	});
</script>

<GridItemTabs tabState={logsTabState} />
{#if logsTabState.activeEntity?.id === 'all'}
	<PanelList listItems={Object.values(clientLogs)}>
		{#snippet listItem({ item: log })}
			<PanelListBtn
				disabled={logsTabState.findIdx(log.id) >= 0}
				onclick={() => logsTabState.openTab(log)}
			>
				<span class="font-bold">{log.label}</span>
				<span class="text-surface-800-100-token justify-self-end text-sm">
					{#if log.services.length > 0}
						{log.services.map(({ label }) => label).join(' | ')}
					{:else}
						No services
					{/if}
				</span>
				<span class="col-span-2 max-h-24 justify-self-start truncate">{log.note}</span>
			</PanelListBtn>
		{/snippet}
	</PanelList>
{:else if activeLog}
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
{:else}
	<LogForm
		action="create"
		{logForm}
		lookups={clientLogsFormLookups}
		formOpts={{
			onUpdate({ form }) {}
		}}
	></LogForm>
{/if}
