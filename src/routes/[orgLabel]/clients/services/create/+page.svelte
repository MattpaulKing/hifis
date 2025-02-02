<script lang="ts">
	import { getDrawerStore } from '$lib/components/drawer';
	import { FormCard } from '$lib/components/forms';
	import { ClientsServicesForm } from '../lib';

	let { data } = $props();
	let drawerStore = getDrawerStore();
</script>

<FormCard drawerOpen={drawerStore.isOpen}>
	<ClientsServicesForm
		clientServiceForm={data.clientServiceForm}
		lookups={data.lookups}
		disabledFields={data.disabledFields}
	/>
</FormCard>
