<script lang="ts">
	import { LookupStore } from '$src/lib/components/forms/index.js';
	import { lookupCtxDefault, lookupCtxFromSingle } from '$src/lib/interfaces/lookups.js';
	import { ServiceEventClientForm } from '../lib';

	let { data } = $props();
	let lookups = $state({
		client: new LookupStore(data.client ? lookupCtxFromSingle(data.client) : lookupCtxDefault()),
		service: new LookupStore(data.service ? lookupCtxFromSingle(data.service) : lookupCtxDefault()),
		serviceEvent: new LookupStore(
			data.serviceEvent ? lookupCtxFromSingle(data.serviceEvent) : lookupCtxDefault()
		)
	});
	lookups.client.excludedIds = data.serviceEventAttendeeIds;
	let disabledFields = {
		clientId: !!data.client,
		serviceId: !!data.service,
		serviceEventId: !!data.serviceEvent
	};
</script>

<ServiceEventClientForm
	action={data.searchParams.action}
	clientServiceEventForm={data.serviceEventClientForm}
	{lookups}
	{disabledFields}
></ServiceEventClientForm>
