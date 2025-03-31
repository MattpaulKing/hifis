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
		InputDateTime
	} from '$src/lib/components/forms';
	import { serviceEventsSchema } from './schema/index.js';
	let { data } = $props();
	let form = initForm({ form: data.serviceEventForm, schema: serviceEventsSchema });
</script>

<FormCard>
	<FormContainer {form} action="">
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
		<FormBtns></FormBtns>
	</FormContainer>
</FormCard>
