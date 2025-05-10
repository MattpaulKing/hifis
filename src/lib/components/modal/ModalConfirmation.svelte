<script lang="ts">
	import { SquareXIcon, TriangleAlertIcon } from '@lucide/svelte';
	import { getModalStore } from './context';
	import type { ModalResponse } from './store.svelte';

	let { data }: { data: { id: string; message: string } } = $props();
	let modalStore = getModalStore();
	function handleModal(responseType: ModalResponse) {
		modalStore.queue[modalStore.showingIdx].response(responseType);
	}
</script>

<div class="card relative flex flex-col items-center justify-start gap-y-4 p-6">
	<button
		class="btn-icon btn-icon-sm absolute right-2 top-2 transition-colors rounded-token hover:variant-filled"
		onclick={() => handleModal({ type: 'close' })}
	>
		<SquareXIcon class="h-7 w-7" />
	</button>
	<div class="flex w-full place-items-center justify-start gap-x-4">
		<TriangleAlertIcon class="h-12 w-12 stroke-warning-500" />
		<span class="text-2xl font-bold">Warning</span>
	</div>
	<span class="max-w-80 text-lg">{data.message}</span>
	<div class="flex w-full justify-end gap-x-4">
		<button
			class="variant-ghost btn transition-colors hover:variant-filled-error"
			onclick={() => handleModal({ type: 'navigate' })}>Close without saving</button
		>
		<button class="variant-filled-success btn" onclick={() => handleModal({ type: 'save' })}>
			Save
		</button>
	</div>
</div>
