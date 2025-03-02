<script lang="ts">
	import { FormCard } from '$src/lib/components/forms/index.js';
	import { StepperStore } from '$src/lib/components/stepper/index.js';
	import { ServiceEventForm } from '../lib/index.js';
	let { data } = $props();
	let stepperStore = new StepperStore({
		labels: ['contact', 'services'],
		searchKey: data.serviceEventForm.data.id,
		expanded: true,
		disabledPages: data.searchParams.action === 'create' ? ['services'] : []
	});
</script>

<FormCard>
	<ServiceEventForm action={data.searchParams.action} serviceEventForm={data.serviceEventForm}
	></ServiceEventForm>
</FormCard>
