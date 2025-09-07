<script lang="ts">
	import { slide } from 'svelte/transition';
	import { ArrowLeftIcon } from '@lucide/svelte';
	import { getBuildableGridController } from '../BuildableGridController.svelte';
	import type { Snippet } from 'svelte';

	let { rerenderKey, children }: { rerenderKey?: string; children: Snippet } = $props();
	let controller = getBuildableGridController();
</script>

<div class="min-w-80">
	{#key rerenderKey}
		<div
			in:slide={{ axis: 'x', duration: 800 }}
			class="bg-surface-100-800-token border-surface-500-400-token z-20 h-full w-fit min-w-72 overflow-y-auto border-x border-t"
		>
			<div
				class="grid h-full w-full auto-cols-max auto-rows-min grid-cols-2 gap-2 p-4 transition-all"
			>
				<div class="col-span-2 mb-2 flex w-full place-items-center justify-between">
					<span class="whitespace-nowrap text-lg font-bold capitalize">{controller.menu.label}</span
					>
					<button
						type="button"
						disabled={controller.menu.showing === 'form-elements-list'}
						onclick={() => {
							controller.menuDefault();
						}}
						class="group variant-ghost btn-icon btn-icon-sm rounded-token hover:variant-soft"
					>
						<ArrowLeftIcon class="transition-transform group-hover:-translate-x-1"></ArrowLeftIcon>
					</button>
				</div>

				{@render children()}
			</div>
		</div>
	{/key}
</div>
