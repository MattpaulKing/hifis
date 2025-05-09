<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { getToaster } from './toastState.svelte';
	let toaster = getToaster();
	let containerRect = $state<DOMRectReadOnly | undefined>();
</script>

<div
	bind:contentRect={containerRect}
	class="fixed bottom-4 right-8 z-[9999] flex h-fit w-80 max-w-80 flex-col items-end gap-y-2"
>
	{#each toaster.queue as toast (toast.id)}
		<div
			animate:flip
			in:fly={{ y: containerRect.y, x: containerRect.x }}
			out:fade
			class="{toast.type === 'info'
				? 'bg-surface-300-600-token'
				: toast.type === 'save'
					? 'bg-success-300-600-token text-base-token'
					: toast.type === 'error'
						? 'bg-error-200-700-token'
						: 'bg-white'} ring-surface-300-600-token relative flex h-fit max-h-20 w-fit py-3 pl-4 pr-7 text-lg shadow-lg ring-1 rounded-token"
		>
			<button
				onclick={() => {
					toaster.remove(toast.id);
				}}
				class="btn btn-sm absolute -right-1 -top-1 text-lg font-bold">x</button
			>
			<span class="">{toast.message}</span>
		</div>
	{/each}
</div>
