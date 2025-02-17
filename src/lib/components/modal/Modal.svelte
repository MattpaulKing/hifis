<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import { getModalStore } from './context';
	import type { Modal } from './store.svelte';

	let modals = getModalStore();
	let ActiveModal: null | Modal = $state(null);

	function restoreModalOnForward(e: PopStateEvent & { currentTarget: Window }) {
		if (e.currentTarget.location.search.includes('modal=true') && modals.lastPop) {
			modals.add(modals.lastPop);
		} else if (!e.currentTarget.location.search.includes('modal=true') && modals.showing) {
			modals.close();
		} else if (!e.currentTarget.location.search.includes('modal=true') && !modals.showing) {
			modals.lastPop = null;
		}
	}
	$effect(() => {
		if (modals.showing) {
			ActiveModal = modals.queue[modals.showingIdx];
		} else {
			ActiveModal = null;
		}
	});
	function closeModal() {
		if (!ActiveModal) return;
		modals.queue[modals.showingIdx].response({ type: 'close' });
		pushState(modals.queue[modals.showingIdx].routes.from, page.data);
		modals.close();
	}
	function onkeydown({ key }: KeyboardEvent) {
		if (key === 'Escape') {
			closeModal();
		}
	}
	function clickedWithinModal(e: MouseEvent) {
		if (!modalContainer?.contains(e.target as Node | null)) {
			return false;
		}
		return true;
	}
	function onclick(e: MouseEvent) {
		if (!clickedWithinModal(e)) {
			closeModal();
		}
	}
	function handleEsc(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeModal();
		}
	}
	let backdropEl = $state<HTMLElement | undefined>();
	let modalContainer = $state<HTMLElement | undefined>();
</script>

<svelte:window onkeydown={handleEsc} onpopstate={restoreModalOnForward} />
{#if ActiveModal}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		bind:this={backdropEl}
		role="dialog"
		aria-modal={true}
		{onclick}
		{onkeydown}
		class="bg-surface-backdrop-token absolute z-[9999] flex h-screen w-screen flex-col items-center justify-center"
	>
		<div in:slide bind:this={modalContainer}>
			<ActiveModal.ref {...ActiveModal.props()} />
		</div>
	</div>
{/if}
