<script lang="ts">
	import {
		Field,
		FormBtns,
		FormContainer,
		Input,
		InputTextArea,
		Label
	} from '$src/lib/components/forms';
	import type { entitySchema } from '$src/schemas';
	import type { Infer, SuperForm } from 'sveltekit-superforms';
	let { form, action }: { form: SuperForm<Infer<typeof entitySchema>>; action: string } = $props();
</script>

<FormContainer {form} {action} class="col-span-2">
	<div class="col-span-2 flex w-full flex-col">
		<Field {form} path="label">
			<Label label="Entity Label" />
			<Input />
		</Field>
		<Field {form} path="description">
			<Label label="Description" />
			<InputTextArea />
		</Field>
		<FormBtns />
	</div>
</FormContainer>
