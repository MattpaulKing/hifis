<script lang="ts">
	import { getDrawerStore } from '$lib/components/drawer';
	import { FormCard } from '$lib/components/forms';
	import { ClientServiceForm } from '../lib';

	let { data } = $props();
	let drawerStore = getDrawerStore();
</script>

<FormCard drawerOpen={drawerStore.isOpen}>
	<ClientServiceForm
		clientServiceForm={data.clientServiceForm}
		lookups={data.lookups}
		disabledFields={data.disabledFields}
	/>
</FormCard>
