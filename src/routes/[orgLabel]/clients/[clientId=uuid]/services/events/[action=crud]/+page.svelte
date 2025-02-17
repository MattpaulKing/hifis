<script lang="ts">
	import {
		initForm,
		Errors,
		Field,
		FormBtns,
		FormCard,
		FormContainer,
		FormTitle,
		InputLookup,
		Label,
		LookupDropdown
	} from '$src/lib/components/forms';
	import { LookupStore } from '$src/lib/components/forms/inputs/LookupStore.svelte.js';
	import { lookupCtxDefault, lookupCtxFromSingle } from '$src/lib/interfaces/lookups.js';
	import { route } from '$src/lib/ROUTES.js';
	import { clientServiceEventsFormSchema } from '../schema/index.js';
	let { data } = $props();

	let form = initForm({ form: data.serviceEventForm, schema: clientServiceEventsFormSchema });
	let { form: formData } = form;
	let lookups = $state({
		client: new LookupStore(lookupCtxFromSingle(data.client)),
		service: new LookupStore(data.service ? lookupCtxFromSingle(data.service) : lookupCtxDefault()),
		serviceEvent: new LookupStore({
			...lookupCtxDefault(),
			excludedIds: data.excludedServiceEventIds
		})
	});

	//BUG: Service Event isn't filtered out
</script>

<FormCard>
	<FormContainer
		{form}
		action={route('default /[orgLabel]/clients/[clientId=uuid]/services/events/[action=crud]', {
			orgLabel: data.org.label,
			clientId: data.searchParams.clientId,
			action: data.searchParams.action
		})}
	>
		<FormTitle>
			<span>
				{#if data.searchParams.action === 'create'}
					Add Client to Service Events
				{:else}
					Update Client's Service Events
				{/if}
			</span>
		</FormTitle>
		<Field {form} path="clientId" lookups={lookups.client}>
			<Label label="Client"></Label>
			<InputLookup apiRoute={route('GET /api/v1/clients')} />
			<LookupDropdown />
			<Errors />
		</Field>
		<Field {form} path="serviceId" lookups={lookups.service}>
			<Label label="Service"></Label>
			<InputLookup apiRoute={route('GET /api/v1/services')} />
			<LookupDropdown />
			<Errors />
		</Field>
		<Field class="col-span-2" {form} path="serviceEventId" lookups={lookups.serviceEvent}>
			<Label label="Service Event"></Label>
			<InputLookup
				apiRoute={`${route('GET /api/v1/services/events')}?serviceId=${$formData.serviceId}&lookups=true`}
			/>
			<LookupDropdown />
			<Errors />
		</Field>
		<FormBtns></FormBtns>
	</FormContainer>
</FormCard>
