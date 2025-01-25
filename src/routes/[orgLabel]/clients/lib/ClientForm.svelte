<script lang="ts">
	import {
		Errors,
		Field,
		Input,
		InputDate,
		InputLookup,
		LookupDropdown,
		Label,
		getFormMsgStore,
		FormBtns
	} from '$lib/components/forms';
	import { route } from '$lib/ROUTES';
	import { Debouncer } from '$lib/api';
	import type { Infer, SuperForm } from 'sveltekit-superforms';
	import type { CRUD } from '../../../../params/crud';
	import type { Lookup } from '$lib/interfaces/Lookup';
	import type { clientsFormSchema } from '../schema';
	import type { Snippet } from 'svelte';

	type Props = {
		form: SuperForm<Infer<typeof clientsFormSchema>>;
		lookups: { org: Lookup[] };
		crud: CRUD;
		stepper?: Snippet;
		possibleDuplicates: Lookup[];
	};
	let {
		form,
		crud,
		lookups,
		stepper: _stepper,
		possibleDuplicates = $bindable([])
	}: Props = $props();
	let { form: formData } = form;

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
<Field
	disabled={true}
	{form}
	path="orgId"
	lookupCtx={{ lookups: lookups.org, inputValue: lookups.org[0].label }}
>
	<Label label="Organization" />
	<InputLookup apiRoute="GET /api/v1/organizations" />
	<LookupDropdown />
	<Errors />
</Field>
<FormBtns></FormBtns>
