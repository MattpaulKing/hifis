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
		getFormMsgStore,
		FormBtns
	} from '$lib/components/forms';
	import { route, type KIT_ROUTES } from '$lib/ROUTES';
	import type { Infer, SuperForm } from 'sveltekit-superforms';
	import type { usersFormSchema } from '../schema';
	import type { CRUD } from '../../../../params/crud';
	import type { Lookup } from '$lib/interfaces/Lookup';

	type Props = {
		form: SuperForm<Infer<typeof usersFormSchema>>;
		lookups: { org: Lookup[] };
		action: {
			path: keyof KIT_ROUTES['ACTIONS'];
			params: Record<KIT_ROUTES['ACTIONS']['create /[orgLabel]/users/create'], string>;
		};
		crud: CRUD;
	};
	let { form, action, crud, lookups }: Props = $props();
	let msgStore = getFormMsgStore();
</script>

<FormContainer class="min-w-96 max-w-2xl" {form} action={route(action.path, action.params)}>
	<div class="col-span-2 mb-4 flex w-full flex-col gap-y-4">
		<FormTitle>
			{#if crud === 'create'}
				Invite User
			{:else if crud === 'update'}
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
	<Field {form} path="orgId" lookupCtx={{ lookups: lookups.org, inputValue: lookups.org[0].label }}>
		<Label label="Organization" />
		<InputLookup apiRoute="GET /api/v1/organizations" />
		<LookupDropdown />
		<Errors />
	</Field>
	<FormBtns>
		{#snippet btnRight()}
			<button class="variant-filled-success btn">
				{#if crud === 'create'}
					Invite
				{:else}
					Submit
				{/if}
			</button>
		{/snippet}
	</FormBtns>
</FormContainer>
