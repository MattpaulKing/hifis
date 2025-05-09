<script lang="ts">
	import { getModalStore } from './context';
	import type { ModalResponse } from './store.svelte';

	let { data }: { data: { id: string; message: string } } = $props();
	let modalStore = getModalStore();
	function handleModal(responseType: ModalResponse) {
		modalStore.queue[modalStore.showingIdx].response(responseType);
	}
</script>

<div class="card flex max-w-80 flex-col p-4">
	<span class="text-lg">{data.message}</span>
	<div class="flex w-full justify-between">
		<button onclick={() => handleModal({ type: 'close' })} class="variant-filled-error btn"
			>Close</button
		>
		<button onclick={() => handleModal({ type: 'save' })} class="variant-filled-success btn"
			>Save</button
		>
	</div>
</div>
