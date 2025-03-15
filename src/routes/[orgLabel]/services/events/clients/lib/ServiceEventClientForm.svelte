<script lang="ts">
	import { clientServiceEventsFormSchema } from '$routes/[orgLabel]/clients/[clientId=uuid]/services/events/schema/index.js';
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
	import { getUser } from '$src/lib/components/user';
	import { route } from '$src/lib/ROUTES.js';
	import type { FormValidated } from '$src/lib/interfaces';
	import type { CRUD } from '$src/params/crud';

	type Props = {
		clientServiceEventForm: FormValidated<typeof clientServiceEventsFormSchema>;
		lookups: {
			client: LookupStore;
			service: LookupStore;
			serviceEvent: LookupStore;
		};
		action: CRUD;
		disabledFields: Partial<
			Record<keyof FormValidated<typeof clientServiceEventsFormSchema>['data'], boolean>
		>;
	};
	let { clientServiceEventForm, lookups, action, disabledFields }: Props = $props();
	let user = getUser();
	let form = initForm({
		form: clientServiceEventForm,
		schema: clientServiceEventsFormSchema
	});
	let { form: formData } = form;
	$inspect(lookups.serviceEvent.inputValue);
</script>

<FormCard>
	<FormContainer
		{form}
		action={route('default /[orgLabel]/services/events/clients/[action=crud]', {
			orgLabel: user.properties.orgLabel,
			action
		})}
	>
		<FormTitle>
			<span>
				{#if action === 'create'}
					Add Client to Service Events
				{:else}
					Update Client's Service Events
				{/if}
			</span>
		</FormTitle>
		<Field {form} path="clientId" disabled={disabledFields.clientId} lookups={lookups.client}>
			<Label label="Client"></Label>
			<InputLookup apiRoute={route('GET /api/v1/clients')} />
			<LookupDropdown />
			<Errors />
		</Field>
		<Field {form} path="serviceId" disabled={disabledFields.serviceId} lookups={lookups.service}>
			<Label label="Service"></Label>
			<InputLookup apiRoute={route('GET /api/v1/services')} />
			<LookupDropdown />
			<Errors />
		</Field>
		<Field
			class="col-span-2"
			{form}
			path="serviceEventId"
			disabled={disabledFields.serviceEventId}
			lookups={lookups.serviceEvent}
		>
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
