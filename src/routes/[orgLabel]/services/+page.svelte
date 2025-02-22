<script lang="ts">
	import { route } from '$src/lib/ROUTES';
	let { data } = $props();
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	{#each data.services as service}
		<a
			href={route('/[orgLabel]/services/[serviceId=uuid]', {
				orgLabel: data.org.label,
				serviceId: service.id
			})}
		>
			{service.label}
		</a>
	{/each}
</div>
