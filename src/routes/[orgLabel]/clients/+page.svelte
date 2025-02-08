<script lang="ts">
	import { route } from '$src/lib/ROUTES.js';
	let { data } = $props();
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	{#each data.clients as client}
		<a
			href={route('/[orgLabel]/clients/[clientId=uuid]', {
				orgLabel: data.org.label,
				clientId: client.id
			})}>{client.label}</a
		>
	{/each}
</div>
