<script lang="ts">
	import { FormContainer, initClientForm } from '$lib/components/forms/index.js';
	import { Step, Stepper, StepperStore } from '$lib/components/stepper';
	import { route } from '$lib/ROUTES';
	import Grid, { GridItem } from 'svelte-grid-extended';
	import { ClientForm } from '../lib';
	import { clientsFormSchema } from '../schema/index.js';
	import { Debouncer } from '$lib/api';
	import { saveUserGrid } from '$lib/components/user-grid';

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

	let outer = $state([
		{ x: 0, y: 0, h: 18, w: 20, version: 1 },
		{ x: 20, y: 0, h: 10, w: 20, version: 1 }
	]);
	let debouncer = new Debouncer({ callback: async () => await saveUserGrid(outer) });
</script>

<div class="flex h-full w-full">
	<Grid
		on:change={() => debouncer.search()}
		cols={120}
		rows={60}
		itemSize={{ width: 16, height: 16 }}
	>
		{#each outer as item, i}
			<GridItem
				activeClass="opacity-0"
				previewClass="bg-surface-500-400-token"
				class="min-h-fit overflow-auto"
				bind:x={item.x}
				bind:y={item.y}
				bind:w={item.w}
				bind:h={item.h}
			>
				{#if i === 0}
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
						<ClientForm {form} lookups={data.lookups} {possibleDuplicates} crud="create"
						></ClientForm>
					</FormContainer>
				{/if}
			</GridItem>
		{/each}
	</Grid>
</div>
