<script lang="ts">
	import { getDrawerStore } from '$lib/components/drawer';
	import { FormCard } from '$lib/components/forms';
	import { LookupStore } from '$src/lib/components/forms/inputs/LookupStore.svelte';
	import { ClientServiceForm } from '../lib';

	let { data } = $props();
	let drawerStore = getDrawerStore();
	let lookups = {
		clients: new LookupStore(data.lookups.clients),
		services: new LookupStore(data.lookups.services)
	};
</script>

<FormCard drawerOpen={drawerStore.isOpen}>
	<ClientServiceForm clientServiceForm={data.clientServiceForm} action={data.action} {lookups} />
</FormCard>
