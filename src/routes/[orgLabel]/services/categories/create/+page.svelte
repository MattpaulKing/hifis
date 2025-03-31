<script lang="ts">
	import { Debouncer } from '$lib/api';
	import { getDrawerStore } from '$lib/components/drawer';
	import {
		Errors,
		Field,
		FormBtns,
		FormContainer,
		getFormMsgStore,
		initForm,
		Input,
		InputTextArea,
		Label
	} from '$lib/components/forms';
	import { route } from '$lib/ROUTES';
	import { serviceCategoriesSchema} from '../schema';

	let { data } = $props();
	let form = initForm({
		form: data.serviceCategoryForm,
		schema: serviceCategoriesFormSchema,
		opts: {
			resetForm: true,
			onUpdate({ form, result }) {}
		}
	});

	let { form: formData } = form;
	let possibleDuplicates = $state([]);
	let debouncer = new Debouncer({ callback: fetchDuplicates });
	let msgStore = getFormMsgStore();
	let drawerStore = getDrawerStore();

	async function fetchDuplicates() {
		if (!$formData.label) return;
		possibleDuplicates = await fetch(
			`${route('GET /api/v1/services/categories')}?search=${$formData.label}&lookups=true`
		).then(async (r) => await r.json());
		if (possibleDuplicates.length > 0) {
			msgStore.setMsg({ msg: 'There may be duplicates', status: 'error' });
		}
	}
</script>

<FormContainer
	class="w-full max-w-lg"
	{form}
	action={route('create /[orgLabel]/services/categories/create', { orgLabel: data.org.label })}
	drawerOpen={drawerStore.isOpen}
>
	{#snippet title()}
		<span>Add a Service Category</span>
	{/snippet}
	<Field {form} path="label" class="col-span-2">
		<Label label="Name">
			<!-- TODO: Show possible duplicates as a hoverable here -->
		</Label>
		<Input type="text" onkeydown={() => debouncer.search()} />
		<Errors />
	</Field>
	<Field {form} path="description" class="col-span-2">
		<Label label="Description"></Label>
		<InputTextArea />
		<Errors />
	</Field>
	<FormBtns></FormBtns>
</FormContainer>
