<script lang="ts">
	import { getDrawerStore } from '$lib/components/drawer';
	import { FormCard } from '$lib/components/forms';
	import { ServiceReferralForm } from '$routes/[orgLabel]/services/[serviceId=uuid]/referrals/lib/index.js';
	import { LookupStore } from '$src/lib/components/forms';

	let { data } = $props();
	let drawerStore = getDrawerStore();
	let lookups = {
		clients: new LookupStore(data.lookups.clients),
		services: new LookupStore(data.lookups.services)
	};
</script>

<FormCard drawerOpen={drawerStore.isOpen}>
	<ServiceReferralForm
		clientServiceRelation="attach"
		serviceReferralForm={data.serviceReferralForm}
		action={data.action}
		{lookups}
	/>
</FormCard>
