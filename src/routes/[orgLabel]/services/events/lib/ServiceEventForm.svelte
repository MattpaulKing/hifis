<script lang="ts">
	import {
		initForm,
		Errors,
		Field,
		FormBtns,
		FormContainer,
		FormTitle,
		Input,
		InputNumber,
		Label,
		InputDateTime,
		InputTextArea
	} from '$src/lib/components/forms';
	import { getUser } from '$src/lib/components/user/userContext.svelte.js';
	import { route } from '$src/lib/ROUTES.js';
	import { serviceEventsSchema } from '../schema/index.js';
	import type { FormValidated } from '$src/lib/interfaces/forms.js';
	import type { CRUD } from '$src/params/crud.js';
	import type { FormOptions, Infer } from 'sveltekit-superforms';

	let {
		serviceEventForm,
		action,
		opts
	}: {
		serviceEventForm: FormValidated<typeof serviceEventsSchema>;
		action: CRUD;
		opts?: FormOptions<Infer<typeof serviceEventsSchema>>;
	} = $props();
	let form = initForm({
		form: { ...serviceEventForm },
		schema: serviceEventsSchema,
		opts
	});
	let user = getUser();
	let { form: formData } = form;
	$inspect($formData);
</script>

<FormContainer
	{form}
	action={route('default /[orgLabel]/services/events/[action=crud]', {
		orgLabel: user.properties.orgLabel,
		action
	})}
>
	<FormTitle>
		{#if action === 'create'}
			Add Service Event
		{:else}
			Update Service Event
		{/if}
	</FormTitle>
	<Field {form} path="label">
		<Label label="Event Title"></Label>
		<Input type="text" />
		<Errors />
	</Field>
	<Field {form} path="spaces">
		<Label label="Spaces" />
		<InputNumber />
		<Errors />
	</Field>
	<Field {form} path="startTS">
		<Label label="Start Date" />
		<InputDateTime {form} />
		<Errors />
	</Field>
	<Field {form} path="endTS">
		<Label label="End Date" />
		<InputDateTime {form} />
		<Errors />
	</Field>
	<Field {form} path="description" class="col-span-2">
		<Label label="Description" />
		<InputTextArea />
		<Errors />
	</Field>
	<FormBtns></FormBtns>
</FormContainer>
