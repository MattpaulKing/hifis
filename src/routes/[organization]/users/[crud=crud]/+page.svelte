<script lang="ts">
	import {
		Errors,
		Field,
		FormContainer,
		FormTitle,
		initClientForm,
		Input,
		InputLookup,
		LookupContext,
		LookupDropdown,
		Label
	} from '$lib/components/forms';
	import { route } from '$lib/ROUTES.js';
	import { usersInsertSchema } from '../schema/index.js';

	let { data } = $props();
	let form = initClientForm({ form: data.userForm, schema: usersInsertSchema });
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<FormContainer
		class="min-w-96 max-w-2xl"
		{form}
		action={route('default /[organization]/[crud=crud]', { organization: '123', crud: 'update' })}
	>
		<FormTitle>User</FormTitle>
		<Field {form} path="firstName">
			<Label label="First Name" />
			<Input type="text" />
			<Errors />
		</Field>
		<Field {form} path="lastName">
			<Label label="Last Name" />
			<Input type="text" />
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
		<Field {form} path="orgId">
			<LookupContext inputValue={data.lookups.org.label}>
				<Label label="Organization" />
				<InputLookup apiRoute="GET /api/organizations" />
				<LookupDropdown />
				<Errors />
			</LookupContext>
		</Field>
	</FormContainer>
</div>
