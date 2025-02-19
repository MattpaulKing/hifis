<script lang="ts">
	import {
		initForm,
		Errors,
		Field,
		FormBtns,
		FormCard,
		FormContainer,
		FormTitle,
		Input,
		InputNumber,
		Label,
		InputDateTime,
		InputTextArea
	} from '$src/lib/components/forms';
	import { route } from '$src/lib/ROUTES.js';
	import { serviceEventsFormSchema } from '../schema/index.js';
	let { data } = $props();
	let form = initForm({ form: data.serviceEventForm, schema: serviceEventsFormSchema });
</script>

<FormCard>
	<FormContainer
		{form}
		action={route('default /[orgLabel]/services/events/[action=crud]', {
			orgLabel: data.org.label,
			action: data.params.action
		})}
	>
		<FormTitle>
			<span> </span>
		</FormTitle>
		<Field {form} path="label">
			<Label label="Event Title"></Label>
			<Input />
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
</FormCard>
