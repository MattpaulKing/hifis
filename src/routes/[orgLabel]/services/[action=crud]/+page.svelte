<script lang="ts">
	import { ServiceContactForm } from '../lib';
	let { data } = $props();
</script>

<ServiceContactForm serviceForm={data.serviceForm}></ServiceContactForm>
