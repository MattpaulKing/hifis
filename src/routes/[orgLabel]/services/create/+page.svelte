<script lang="ts">
	import { getDrawerStore } from '$lib/components/drawer';
	import {
		Errors,
		Field,
		FormContainer,
		initClientForm,
		Input,
		InputTextArea,
		InputLookup,
		Label,
		LookupDropdown,
		FormBtns
	} from '$lib/components/forms';
	import ServiceCategoriesCreatePage from '$routes/[orgLabel]/services/categories/create/+page.svelte';
	import { route } from '$lib/ROUTES';
	import { servicesFormSchema } from '../schema';
	import type { Component } from 'svelte';

	let { data } = $props();
	const orgLabel = data.org.label;
	let form = initClientForm({
		form: data.serviceForm,
		schema: servicesFormSchema,
		opts: {
			resetForm: true
		}
	});
	let drawerStore = getDrawerStore();
	async function openServiceCategoriesAdd() {
		await drawerStore.open({
			ref: ServiceCategoriesCreatePage as Component,
			href: route('/[orgLabel]/services/categories/create', { orgLabel }),
			width: 'w-1/4'
		});
	}
</script>

<FormContainer {form} action={route('create /[orgLabel]/services/create', { orgLabel })}>
	{#snippet title()}
		<span>Add a Service</span>
	{/snippet}
	<Field {form} path="label">
		<Label label="Name"></Label>
		<Input type="text" />
		<Errors />
	</Field>
	<Field {form} path="category" lookupCtx={{}}>
		<Label label="Service Category">
			<button
				type="button"
				class="variant-ghost btn btn-sm relative -top-1 right-2 font-bold"
				onclick={async () => await openServiceCategoriesAdd()}>+</button
			>
		</Label>
		<InputLookup apiRoute={route('GET /api/v1/organizations/services/category')} />
		<LookupDropdown />
		<Errors />
	</Field>
	<Field class="col-span-2" {form} path="description">
		<Label label="Description"></Label>
		<InputTextArea />
		<Errors />
	</Field>
	<Field {form} path="email">
		<Label label="Email"></Label>
		<Input type="email" />
		<Errors />
	</Field>
	<Field {form} path="phone">
		<Label label="Phone"></Label>
		<Input type="tel" />
		<Errors />
	</Field>
	<Field {form} path="address">
		<Label label="Street Address"></Label>
		<Input type="text" />
		<Errors />
	</Field>
	<FormBtns></FormBtns>
</FormContainer>
