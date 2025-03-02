<script lang="ts">
	import { Debouncer } from '$lib/api';
	import {
		Errors,
		Field,
		Input,
		InputDate,
		Label,
		getFormMsgStore,
		FormBtns,
		FormContainer,
		initForm,
		type FormMode
	} from '$lib/components/forms';
	import { route } from '$lib/ROUTES';
	import { getUser } from '$lib/components/user';
	import { clientContactFormSchema } from '../../schema';
	import type { FormValidated } from '$lib/interfaces';
	import type { Lookup } from '$lib/interfaces/Lookup';
	import type { FormOptions, Infer } from 'sveltekit-superforms';

	let {
		clientContactForm,
		action,
		opts
	}: {
		clientContactForm: FormValidated<typeof clientContactFormSchema>;
		action: FormMode;
		opts?: FormOptions<Infer<typeof clientContactFormSchema>>;
	} = $props();
	let user = getUser();
	let form = initForm({
		form: clientContactForm,
		schema: clientContactFormSchema,
		opts
	});

	let { form: formData } = form;
	let possibleDuplicates = $state<Lookup[]>([]);
	let debouncer = new Debouncer({ callback: fetchDuplicates });
	let msgStore = getFormMsgStore();

	async function fetchDuplicates() {
		if (!$formData.firstName || !$formData.lastName) return;
		possibleDuplicates = await fetch(
			`${route('GET /api/v1/clients')}?search=${$formData.firstName} ${$formData.lastName}&lookups=true`
		).then(async (r) => await r.json());
		if (possibleDuplicates.length > 0) {
			msgStore.setMsg({ msg: 'There may be duplicates', status: 'error' });
		}
	}
</script>

<FormContainer
	class="min-w-96 max-w-lg p-6"
	{form}
	action={route('default /[orgLabel]/clients/[action=crud]', {
		action,
		orgLabel: user.properties.orgLabel
	})}
>
	{#snippet title()}
		<span class="w-fit"> Client Profile </span>
	{/snippet}
	<Field {form} path="firstName">
		<Label label="First Name" />
		<Input type="text" />
		<Errors />
	</Field>
	<Field {form} path="lastName">
		<Label label="Last Name" />
		<Input type="text" onkeydown={() => debouncer.search()} />
		<Errors />
	</Field>
	<Field {form} path="dob">
		<Label label="Date of Birth" />
		<InputDate {form} />
		<Errors />
	</Field>
	<Field {form} path="phone">
		<Label label="Phone" />
		<Input type="tel" />
		<Errors />
	</Field>
	<Field {form} path="email">
		<Label label="Email" />
		<Input type="email" />
		<Errors />
	</Field>
	<FormBtns></FormBtns>
</FormContainer>
