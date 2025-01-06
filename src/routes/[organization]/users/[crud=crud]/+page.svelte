<script lang="ts">
	import {
		Errors,
		Field,
		FormContainer,
		FormTitle,
		Input,
		InputLookup,
		LookupDropdown,
		Label,
		initClientForm,
		getFormMsgStore
	} from '$lib/components/forms';
	import { route } from '$lib/ROUTES.js';
	import { usersInsertSchema } from '../schema/index.js';

	let { data } = $props();
	let form = initClientForm({
		form: data.userForm,
		schema: usersInsertSchema,
		opts: {
			resetForm: true
		}
	});
	let msgStore = getFormMsgStore();
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<FormContainer
		class="min-w-96 max-w-2xl"
		{form}
		action={route('invite /[organization]/users/[crud=crud]', {
			organization: '123',
			crud: 'update'
		})}
	>
		<div class="col-span-2 mb-4 flex w-full flex-col gap-y-4">
			<FormTitle>
				{#if data.crud === 'create'}
					Invite User
				{:else if data.crud === 'update'}
					Edit User
				{/if}
			</FormTitle>
			<span>{msgStore.current?.msg}</span>
		</div>
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
		<Field
			{form}
			path="orgId"
			lookupCtx={{ lookups: data.lookups.org, inputValue: data.lookups.org[0].label }}
		>
			<Label label="Organization" />
			<InputLookup apiRoute="GET /api/v1/organizations" />
			<LookupDropdown />
			<Errors />
		</Field>
		<div class="col-span-2 mt-6 flex justify-between">
			<div></div>
			<button class="variant-filled-success btn">Invite</button>
		</div>
	</FormContainer>
</div>
