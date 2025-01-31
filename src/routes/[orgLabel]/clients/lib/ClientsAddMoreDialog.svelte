<script lang="ts">
	import { getModalStore } from '$lib/components/modal';
	import { route } from '$lib/ROUTES';
	let { clientId, orgLabel }: { clientId: string; orgLabel: string } = $props();
	let modalStore = getModalStore();
</script>

<div class="card flex flex-col items-center justify-center p-4 shadow-xl">
	<span>Continue adding clients, or edit details?</span>
	<div class="mt-6 flex w-full place-items-center justify-between">
		<button
			onclick={() => {
				modalStore.close();
			}}
			class="variant-filled-success btn">Add Clients</button
		>
		<a
			onclick={() => {
				modalStore.close();
			}}
			href={route('/[orgLabel]/clients/[clientId=uuid]', { orgLabel, clientId })}
		>
			<button class="variant-ghost btn">Edit Details</button>
		</a>
	</div>
</div>
