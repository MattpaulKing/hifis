<script lang="ts">
	import { FormCard } from '$lib/components/forms';
	import { Step, Stepper, StepperStore } from '$lib/components/stepper';
	import { ClientContactForm } from '../lib';

	let { data } = $props();

	let stepperStore = new StepperStore({
		labels: ['contact', 'services'],
		searchKey: 'i',
		expanded: true,
		disabledPages: ['services']
	});
</script>

<FormCard>
	{#snippet stepper()}
		<Stepper title="Details" {stepperStore}>
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
		<ClientContactForm clientContactForm={data.clientContactForm} mode="create"></ClientContactForm>
	{/if}
</FormCard>
