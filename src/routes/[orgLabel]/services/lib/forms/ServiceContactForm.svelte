<script lang="ts">
	import { getDrawerStore } from '$lib/components/drawer';
	import {
		Errors,
		Field,
		FormContainer,
		initForm,
		Input,
		InputTextArea,
		InputLookup,
		Label,
		LookupDropdown,
		FormBtns,
		LookupStore,
		type FormMode,
		FormTitle
	} from '$lib/components/forms';
	import ServiceCategoriesCreatePage from '$routes/[orgLabel]/services/categories/create/+page.svelte';
	import { route } from '$lib/ROUTES';
	import { servicesFormSchema } from '../../schema';
	import { getUser } from '$src/lib/components/user';
	import type { FormValidated } from '$src/lib/interfaces';
	import type { Component } from 'svelte';

	type Props = {
		serviceForm: FormValidated<typeof servicesFormSchema>;
		action: FormMode;
		lookups: { serviceCategory: LookupStore };
	};
	let { serviceForm, action, lookups }: Props = $props();
	let user = getUser();
	const orgLabel = user.properties.orgLabel;
	let form = initForm({
		form: serviceForm,
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
			width: 'xl:w-1/4'
		});
	}
	let { form: formData } = form;
</script>

<FormContainer
	{form}
	action={route('default /[orgLabel]/clients/[action=crud]', { action, orgLabel })}
>
	<FormTitle>
		{#if action === 'create'}
			<span>Add a Service</span>
		{:else}
			<span>Edit {$formData.label}</span>
		{/if}
	</FormTitle>
	<Field {form} path="label">
		<Label label="Service Title"></Label>
		<Input type="text" />
		<Errors />
	</Field>
	<Field {form} path="categoryId" lookups={lookups.serviceCategory}>
		<Label label="Service Category">
			<button
				type="button"
				class="variant-ghost btn btn-sm relative -top-1 right-2 font-bold transition-colors hover:variant-filled"
				onclick={async () => await openServiceCategoriesAdd()}>+</button
			>
		</Label>
		<InputLookup apiRoute={route('GET /api/v1/services/categories')} />
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
		<Input type="address" />
		<Errors />
	</Field>
	<FormBtns></FormBtns>
</FormContainer>
