<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { getDrawerStore } from '.';
	import type { Component } from 'svelte';

	let drawerStore = getDrawerStore();
	let elemBackdrop: HTMLDivElement | undefined = $state();

	function onDrawerInteraction(event: MouseEvent) {
		if (event.target === elemBackdrop) {
			drawerStore.close();
		}
	}

	let ActiveComponent: null | Component = $derived.by(() => {
		if (drawerStore.isOpen && drawerStore.component) {
			return drawerStore.component;
		}
		return null;
	});
</script>

{#if drawerStore.isOpen === true}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		aria-modal="true"
		role="dialog"
		bind:this={elemBackdrop}
		class="bg-surface-backdrop-token fixed bottom-0 left-0 right-0 top-0 z-40 flex justify-end"
		data-testid="drawer-backdrop"
		onmousedown={onDrawerInteraction}
		transition:fade
	>
		<!-- Drawer -->
		<!-- separate In/Out so anim values update -->
		<div
			class="bg-surface-100-800-token h-full {drawerStore.width} overflow-y-auto shadow-xl transition-transform rounded-tl-container-token rounded-bl-container-token"
			data-testid="drawer"
			role="dialog"
			aria-modal="true"
			transition:fly={{ x: window.innerHeight, y: 0 }}
		>
			<ActiveComponent data={drawerStore.componentData} />
		</div>
	</div>
{/if}
