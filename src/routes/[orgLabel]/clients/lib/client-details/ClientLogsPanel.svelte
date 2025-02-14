<script lang="ts">
	import { GridItemTabs, GridItemTabsState } from '$src/lib/components/user-grid';
	import { LookupStore } from '$src/lib/components/forms/inputs/LookupStore.svelte';
	import { lookupCtxDefault, lookupCtxFromSingle } from '$src/lib/interfaces/lookups';
	import { LogForm, type aggLogsWitsClientsAndServices } from '$routes/[orgLabel]/logs/lib';
	import type { clients } from '$src/schemas';
	import type { FormValidated } from '$src/lib/interfaces';
	import type { logsFormSchema } from '$routes/[orgLabel]/logs/schema';
	import { fade } from 'svelte/transition';

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
		services: new LookupStore(lookupCtxDefault())
	});
</script>

<GridItemTabs tabState={logsTabState} />
{#if logsTabState.activeEntity?.id === 'all'}
	<div
		in:fade={{ duration: 700 }}
		class="flex w-fit min-w-80 max-w-xl flex-col gap-x-4 bg-inherit p-4"
	>
		<span class="col-span-2 mx-5 text-xl font-bold">All Services</span>
		<ul class="list mt-2">
			{#each Object.values(clientLogs) as log}
				<li class="">
					<button
						disabled={logsTabState.findIdx(log.id) >= 0}
						onclick={() => logsTabState.openTab(log)}
						class="btn btn-sm grid w-full grid-cols-2 gap-2 hover:variant-ghost disabled:cursor-not-allowed"
					>
						<span class="-ml-3 font-bold">{log.label}</span>
						<span class="text-surface-800-100-token justify-self-end text-sm"
							>{log.services.map(({ label }) => label).join(' | ')}</span
						>
						<span class="col-span-2 max-h-24 max-w-full justify-self-start truncate"
							>{log.note}</span
						>
					</button>
				</li>
			{/each}
		</ul>
	</div>
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
	<LogForm {logForm} mode="create" lookups={clientLogsFormLookups}></LogForm>
{/if}
