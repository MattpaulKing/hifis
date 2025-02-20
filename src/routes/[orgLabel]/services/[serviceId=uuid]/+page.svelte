<script lang="ts">
	import { FormCard } from '$src/lib/components/forms';
	import { Step, Stepper, StepperStore } from '$src/lib/components/stepper';
	import { ServiceContactForm } from '../lib';

	let { data } = $props();
	let stepperStore = new StepperStore({
		labels: ['contact', 'clients', 'events'],
		searchKey: 'i',
		expanded: true
	});
</script>

<FormCard>
	{#snippet stepper()}
		<Stepper title="Service" {stepperStore}>
			{#each stepperStore.pages as page, idx}
				<Step {stepperStore} {idx} {page}>
					{stepperStore.expanded ? page.label : idx + 1}
				</Step>
			{/each}
		</Stepper>
	{/snippet}
	{#if stepperStore.activePage.label === 'contact'}
		<ServiceContactForm serviceForm={data.serviceForm}></ServiceContactForm>
	{/if}
</FormCard>
