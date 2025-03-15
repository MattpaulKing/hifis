<script lang="ts">
	import { page } from '$app/state';
	import { FormCard, initForm } from '$lib/components/forms';
	import { Step, Stepper, StepperStore } from '$lib/components/stepper';
	import { getModalStore } from '$src/lib/components/modal';
	import { ClientContactForm } from '../lib';
	import { default as ClientsKeepAdding } from '$routes/[orgLabel]/clients/lib/ClientsAddMoreDialog.svelte';
	import { getUser } from '$src/lib/components/user';
	import { clientContactFormSchema } from '../schema';

	let { data } = $props();

	let stepperStore = new StepperStore({
		labels: ['contact', 'services'],
		searchKey: data.clientContactForm.data.id,
		expanded: true,
		disabledPages: data.searchParams.action === 'create' ? ['services'] : []
	});
	let modalStore = getModalStore();
	let user = getUser();
	let clientContactForm = initForm({
		form: data.clientContactForm,
		schema: clientContactFormSchema
	});
</script>

<FormCard>
	{#snippet stepper()}
		<Stepper label="Details" {stepperStore}>
			{#each stepperStore.pages as page, idx}
				<Step {stepperStore} {idx} {page}>
					{#if stepperStore.expanded}
						{page.label}
					{:else}
						{idx + 1}
					{/if}
				</Step>
			{/each}
		</Stepper>
	{/snippet}

	{#if stepperStore.activePage.label === 'contact'}
		<ClientContactForm
			{clientContactForm}
			action={data.searchParams.action}
			opts={{
				onUpdate({ form }) {
					if (form.valid && data.searchParams.action === 'create') {
						modalStore.add({
							id: 'clients-create',
							type: 'component',
							ref: ClientsKeepAdding,
							props: () => ({ orgLabel: user.properties.orgLabel, clientId: form.data.id }),
							routes: { from: page.url.toString(), to: page.url.toString() }
						});
					}
				}
			}}
		></ClientContactForm>
	{/if}
</FormCard>
