<script lang="ts">
	import {
		Errors,
		Field,
		FormBtns,
		FormContainer,
		FormTitle,
		initForm,
		Input,
		InputTextArea,
		Label
	} from '$src/lib/components/forms/index.js';
	import { route } from '$src/lib/ROUTES.js';
	import { logCategoriesFormSchema } from '../../schema/index.js';

	let { data } = $props();
	let form = initForm({ form: data.logCategoryForm, schema: logCategoriesFormSchema });
</script>

<FormContainer
	{form}
	action={route('default /[orgLabel]/logs/categories/[action=crud]', {
		orgLabel: data.org.label,
		action: data.params.action
	})}
>
	<FormTitle>
		{#if data.params.action === 'create'}
			Add Log Category
		{:else}
			Edit Log Category
		{/if}
	</FormTitle>
	<Field {form} path="label" class="col-span-2">
		<Label label="Category" />
		<Input />
		<Errors />
	</Field>
	<Field {form} path="description" class="col-span-2">
		<Label label="Category" />
		<InputTextArea />
		<Errors />
	</Field>
	<FormBtns></FormBtns>
</FormContainer>
