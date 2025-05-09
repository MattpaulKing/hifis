<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { getToaster } from './toastState.svelte';
	import { SaveIcon } from '@lucide/svelte';
	let toaster = getToaster();
	let containerRect = $state<DOMRectReadOnly | undefined>();
</script>

<div
	bind:contentRect={containerRect}
	class="fixed bottom-4 right-8 z-[9999] flex h-fit w-80 max-w-80 flex-col items-end gap-y-2"
>
	{#each toaster.queue as toast (toast.id)}
		<button
			onclick={() => {
				toaster.remove(toast.id);
			}}
			animate:flip
			in:fly={{ y: containerRect.y, x: containerRect.x }}
			out:fade
			class="ring-surface-400-500-token relative flex h-fit max-h-20 w-fit py-3 pl-4 pr-10 text-lg shadow-lg ring-1 rounded-token hover:opacity-50"
		>
			{#if toast.type === 'save'}
				<div class="flex place-items-center gap-x-3">
					<span class="badge p-1">
						<SaveIcon class="stroke-success-500" />
					</span>
					<span class="">{toast.message}</span>
				</div>
			{:else}
				<span class="">{toast.message}</span>
			{/if}
		</button>
	{/each}
</div>
