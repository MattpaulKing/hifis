<script lang="ts">
	import {
		Field,
		FieldArray,
		FormBtns,
		FormContainer,
		FormTitle,
		initForm,
		InputLookup,
		InputTextArea,
		Label,
		LookupDropdown
	} from '$src/lib/components/forms';
	import { logsFormSchema } from '../../schema';
	import { route } from '$src/lib/ROUTES';
	import { getUser } from '$src/lib/components/user';
	import { default as LogCategoriesFormPage } from '$routes/[orgLabel]/logs/categories/[action=crud]/+page.svelte';
	import { getDrawerStore } from '$src/lib/components/drawer';
	import type { FormValidated } from '$src/lib/interfaces';
	import type { LookupStore } from '$src/lib/components/forms/inputs/LookupStore.svelte';
	import type { FormOptions, Infer } from 'sveltekit-superforms';
	import type { Component } from 'svelte';

	let {
		logForm,
		action,
		formOpts,
		lookups
	}: {
		logForm: FormValidated<typeof logsFormSchema>;
		action: 'create' | 'update';
		formOpts?: FormOptions<Infer<typeof logsFormSchema>>;
		lookups: { services: LookupStore; clients: LookupStore; categoryId: LookupStore };
	} = $props();
	let form = initForm({
		form: logForm,
		schema: logsFormSchema,
		opts: formOpts
	});
	let user = getUser();
	let formAction = $derived(
		action === 'create'
			? route('create /[orgLabel]/logs', { orgLabel: user.properties.orgLabel })
			: ''
	);
	let drawerStore = getDrawerStore();
	async function openLogCategoriesCreateDrawer() {
		await drawerStore
			.open({
				ref: LogCategoriesFormPage as Component,
				href: route('/[orgLabel]/logs/categories/[action=crud]', {
					orgLabel: user.properties.orgLabel,
					action: 'create'
				}),
				width: 'xl:w-1/4'
			})
			.then(({ type }) => (type === 'save' ? drawerStore.close() : null));
	}
</script>

<FormContainer class="min-w-96 max-w-lg" {form} action={formAction}>
	<FormTitle>
		{#if action === 'create'}
			Create Log
		{:else}
			Edit Log
		{/if}
	</FormTitle>
	<FieldArray {form} path="serviceIds" lookups={lookups.services}>
		<Label label="Service(s)"></Label>
		<InputLookup apiRoute={route('GET /api/v1/services')}></InputLookup>
		<LookupDropdown></LookupDropdown>
	</FieldArray>
	<Field {form} path="categoryId" lookups={lookups.categoryId}>
		<Label label="Type">
			<button
				type="button"
				class="variant-ghost btn btn-sm relative -top-1 right-2 font-bold"
				onclick={async () => await openLogCategoriesCreateDrawer()}>+</button
			>
		</Label>
		<InputLookup apiRoute={route('GET /api/v1/logs/categories')} />
		<LookupDropdown></LookupDropdown>
	</Field>
	<FieldArray {form} path="clientIds" lookups={lookups.clients} class="col-span-2">
		<Label label="Client(s)"></Label>
		<InputLookup apiRoute={route('GET /api/v1/clients')}></InputLookup>
		<LookupDropdown></LookupDropdown>
	</FieldArray>

	<Field {form} path="note" class="col-span-2">
		<Label label="Log Note"></Label>
		<InputTextArea></InputTextArea>
	</Field>
	<FormBtns></FormBtns>
</FormContainer>
