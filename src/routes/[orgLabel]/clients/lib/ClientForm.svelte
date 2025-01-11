<script lang="ts">
	import {
		Errors,
		Field,
		FormContainer,
		Input,
		InputLookup,
		LookupDropdown,
		Label,
		getFormMsgStore
	} from '$lib/components/forms';
	import { route, type KIT_ROUTES } from '$lib/ROUTES';
	import { Debouncer } from '$lib/api';
	import type { Infer, SuperForm } from 'sveltekit-superforms';
	import type { CRUD } from '../../../../params/crud';
	import type { Lookup } from '$lib/interfaces/Lookup';
	import type { clientsFormSchema } from '../schema';
	import type { Snippet } from 'svelte';

	type Props = {
		form: SuperForm<Infer<typeof clientsFormSchema>>;
		lookups: { org: Lookup[] };
		action: {
			path: keyof KIT_ROUTES['ACTIONS'];
			params: Record<KIT_ROUTES['ACTIONS']['default /[orgLabel]/clients/create'], string>;
		};
		crud: CRUD;
		stepper?: Snippet;
	};
	let { form, action, crud, lookups, stepper: _stepper }: Props = $props();
	let { form: formData } = form;
	let msgStore = getFormMsgStore();

	let possibleDuplicates = $state<Lookup[]>([{ id: '123', label: 'something' }]);
	let debouncer = new Debouncer({ callback: fetchDuplicates });

	async function fetchDuplicates() {
		if (!$formData.firstName || !$formData.lastName) return;
		possibleDuplicates = await fetch(
			`${route('GET /api/v1/clients')}?search=${$formData.firstName} ${$formData.lastName}&lookups=true`
		).then(async (r) => await r.json());
	}
</script>

<FormContainer
	disabled={crud === 'read'}
	class="min-w-96 max-w-lg"
	{form}
	action={route(action.path, action.params)}
>
	{#snippet stepper()}
		{@render _stepper?.()}
	{/snippet}
	{#snippet title()}
		<span class="w-fit">
			{#if crud === 'create'}
				Add Client
			{:else if crud === 'update'}
				Edit Client
			{/if}
		</span>
	{/snippet}
	{#snippet btns()}
		<button
			type="button"
			class="variant-outline btn-icon absolute right-0 top-0 font-bold rounded-token"
		>
			{#if possibleDuplicates.length > 0}
				<span class="variant-filled-error badge absolute -right-1 -top-1 z-10 rounded-full"
					>{possibleDuplicates.length}</span
				>
			{/if}
			<img class="absolute left-0 opacity-80 dark:invert" src="/DotsNine.png" alt="s" />
		</button>
		<!-- <div -->
		<!-- 	class="btn-group absolute right-0 top-0 flex justify-between [&>button]:px-1 [&>button]:py-1" -->
		<!-- > -->
		<!-- 	<button class=""> -->
		<!-- 		<img class="h-5 w-5 dark:invert" src="/Star.png" alt="favourite" /> -->
		<!-- 	</button> -->
		<!-- 	<button> -->
		<!-- 		<img src="/Info.png" class="dark:invert" alt="favourite" /> -->
		<!-- 	</button> -->
		<!-- 	<button> -->
		<!-- 		<img src="/UserList.png" class="dark:invert" alt="favourite" /> -->
		<!-- 	</button> -->
		<!-- 	<button class=""> -->
		<!-- 		<img src="/Gear.png" class="dark:invert" alt="favourite" /> -->
		<!-- 	</button> -->
		<!-- </div> -->
	{/snippet}
	<span class="col-span-2">{msgStore.current?.msg}</span>
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
	<div class="col-span-2 mt-6 flex justify-between">
		<div></div>
		<button class="variant-filled-success btn"> Save </button>
	</div>
</FormContainer>
