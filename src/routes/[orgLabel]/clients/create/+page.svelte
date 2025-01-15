<script lang="ts">
	import { FormContainer, getFormMsgStore, initClientForm } from '$lib/components/forms/index.js';
	import { Step, Stepper, StepperStore } from '$lib/components/stepper';
	import { route } from '$lib/ROUTES';
	import { ClientForm } from '../lib';
	import { clientsFormSchema } from '../schema/index.js';

	let { data } = $props();
	let form = initClientForm({
		form: data.clientForm,
		schema: clientsFormSchema,
		opts: {
			resetForm: true
		}
	});
	let stepperStore = new StepperStore({
		pages: [
			{
				label: 'contact',
				href: route('/[orgLabel]/clients/create', { orgLabel: data.orgLabel })
			},
			{
				label: 'contact2',
				href: route('/[orgLabel]/clients/create', { orgLabel: data.orgLabel }).concat('?some=1')
			}
		],
		expanded: false
	});
	let possibleDuplicates = $state([]);
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<FormContainer
		class="min-w-96 max-w-lg"
		{form}
		action={route('default /[orgLabel]/clients/create', { orgLabel: data.orgLabel })}
	>
		{#snippet stepper()}
			<Stepper title="Steps" {stepperStore}>
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
		{#snippet title()}
			<span class="w-fit"> Add Client </span>
		{/snippet}
		<ClientForm {form} lookups={data.lookups} {possibleDuplicates} crud="create"></ClientForm>
	</FormContainer>
</div>
