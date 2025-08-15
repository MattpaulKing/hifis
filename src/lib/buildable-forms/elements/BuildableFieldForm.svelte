<script lang="ts">
	import type { FormInitialized } from '$src/lib/interfaces/forms';
	import type { entityFieldsSchema } from '$src/schemas';
	import { BuildableInputFieldForm } from '..';
	import { getBuildableGridController } from '../BuildableGridController.svelte';
	import { FormContainer } from '$src/lib/components/forms';
	import { route } from '$src/lib/ROUTES';
	import { getUser } from '$src/lib/components/user';

	let {
		entityFieldForm
	}: {
		entityFieldForm: FormInitialized<typeof entityFieldsSchema>;
	} = $props();

	let controller = getBuildableGridController();
	let fieldType = $derived.by(() => {
		let idx = controller.items.fields.findIndex(({ id }) => id === controller.menu.fieldId);
		return controller.items.fields[idx].fieldType;
	});
	let user = getUser();
</script>

<FormContainer
	form={entityFieldForm}
	action={route('updateEntityField /[orgLabel]/custom-entities/v1/[action=crud]', {
		orgLabel: user.properties.orgLabel,
		action: 'update'
	})}
	class="col-span-2"
>
	{#if fieldType === 'input'}
		<BuildableInputFieldForm {entityFieldForm} />
	{:else if fieldType === 'number'}
		<div></div>
	{:else if fieldType === 'date'}
		<div></div>
	{:else if fieldType === 'lookup'}
		<div></div>
	{:else if fieldType === 'select'}
		<div></div>
	{/if}
</FormContainer>
