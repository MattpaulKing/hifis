<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { StepperStore } from '.';
	import { slide } from 'svelte/transition';
	type EventProps = MouseEvent & { currentTarget: EventTarget & HTMLButtonElement };
	type Props = {
		stepperStore: StepperStore;
		onToggle?: (e: EventProps) => void;
		children: Snippet;
	};
	let { stepperStore, onToggle, children }: Props = $props();
	function onclick(e: EventProps) {
		stepperStore.expanded = !stepperStore.expanded;
		onToggle?.(e);
	}
</script>

{#key stepperStore.expanded}
	<div class="flex w-full md:w-min" in:slide={{ delay: 150, axis: 'x' }}>
		<div
			role="menu"
			tabindex="-1"
			class="card border-surface-300-600-token flex w-full flex-row place-items-baseline gap-x-2
  border-r p-2 hover:will-change-auto md:flex-col md:rounded-br-none md:rounded-tr-none md:p-4"
		>
			<div class="flex w-full place-items-center justify-between gap-x-2 text-lg font-bold">
				{#if stepperStore.expanded}
					<span>Steps</span>
				{/if}
				<button
					{onclick}
					type="button"
					class="variant-ghost btn btn-icon btn-icon-sm hidden rounded-token md:inline-flex"
					><img
						src="/SignOut.png"
						class="h-5 w-5 transition-all duration-500 dark:invert {stepperStore.expanded
							? 'rotate-180'
							: ''}"
						alt="close"
					/></button
				>
			</div>
			<div class="relative z-50 col-span-2 mt-4 flex h-fit w-full">
				<div
					class="bg-surface-400-500-token absolute left-1/2 -z-10 hidden h-full w-0.5 md:block"
				></div>
				<div class="flex w-full gap-x-2 gap-y-4 md:flex-col">
					{@render children()}
				</div>
			</div>
		</div>
	</div>
{/key}
