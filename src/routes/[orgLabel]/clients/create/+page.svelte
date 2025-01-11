<script lang="ts">
	import { initClientForm } from '$lib/components/forms/index.js';
	import { Step, Stepper, StepperStore } from '$lib/components/stepper';
	import { route } from '$lib/ROUTES';
	import { slide } from 'svelte/transition';
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
	let stepperStore = new StepperStore({ pageIdx: 0, pages: ['something', 'sth'], expanded: false });
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<ClientForm
		{form}
		lookups={data.lookups}
		action={{
			path: 'default /[orgLabel]/clients/create',
			params: { orgLabel: data.orgLabel }
		}}
		crud="create"
	>
		{#snippet stepper()}
			<Stepper {stepperStore}>
				{#each stepperStore.pages as page, idx}
					<Step
						{stepperStore}
						{idx}
						href={`${route('/[orgLabel]/clients/create', { orgLabel: data.orgLabel })}?page=1`}
						{page}
					></Step>
				{/each}
			</Stepper>
		{/snippet}
	</ClientForm>
</div>
