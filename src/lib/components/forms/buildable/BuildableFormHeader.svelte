<script lang="ts">
	import { LaptopIcon, ShieldAlertIcon, SmartphoneIcon, TabletIcon } from '@lucide/svelte';
	import { SaveIcon, SaveOffIcon, StarIcon } from '$src/lib';
	import type { Snippet } from 'svelte';
	import type { GridSettings } from '../../user-grid';

	let {
		published,
		screenView = $bindable(),
		taintedInputFieldsExist,
		class: classes,
		children,
		onScreenSizeClick,
		onSave,
		onPublishClick
	}: {
		published: boolean | null | undefined;
		screenView: GridSettings['screenView'];
		taintedInputFieldsExist: boolean;
		class?: string;
		children: Snippet;
		onScreenSizeClick?: () => void;
		onSave: () => void;
		onPublishClick: () => void;
	} = $props();

	let hoveringSave = $state(false);
</script>

<div class="grid h-fit w-full grid-cols-[1fr_auto] items-end gap-x-12 {classes}">
	{@render children()}
	<div class="relative flex h-fit w-fit place-items-center gap-x-3">
		<button
			type="button"
			onclick={() => onPublishClick?.()}
			class="variant-ghost btn flex w-36 justify-center gap-x-2 px-1 transition-all rounded-token hover:brightness-150"
		>
			{#key published}
				<!-- NOTE: Star Icon -->
				<StarIcon class={published ? 'fill-none stroke-warning-500' : 'stroke-surface-100'} />
			{/key}
			{#if published}
				<span>Published</span>
			{:else}
				<span class="ml-2">Draft</span>
			{/if}
		</button>
		<div class="variant-ghost btn-group divide-x-2 divide-surface-400 dark:divide-surface-500">
			{@render viewButton({ view: 'sm' })}
			{@render viewButton({ view: 'lg' })}
			{@render viewButton({ view: 'xl' })}
		</div>
		<button
			type="submit"
			onclick={onSave}
			onpointerover={() => (hoveringSave = true)}
			onpointerout={() => (hoveringSave = false)}
			class="peer relative {taintedInputFieldsExist
				? 'variant-filled-warning transition-colors hover:variant-filled-success'
				: 'variant-filled-success'} btn-icon h-9 rounded-token"
		>
			{#if taintedInputFieldsExist && !hoveringSave}
				<SaveOffIcon transitions={{ in: { duration: 500 } }} />
			{:else}
				<SaveIcon transitions={{ in: { duration: 500 } }} />
			{/if}
		</button>
		{#if taintedInputFieldsExist}
			<div
				class="card absolute right-0 top-full z-10 mt-2 hidden w-64 grid-cols-[auto_1fr] gap-x-4 gap-y-2 p-4 peer-hover:grid"
			>
				<ShieldAlertIcon class="h-full w-full stroke-error-500" />
				<span class="text-lg font-bold">Warning</span>
				<span class="col-span-2">There are fields that have not been saved yet.</span>
			</div>
		{/if}
	</div>
</div>
{#snippet viewButton({ view }: { view: 'sm' | 'lg' | 'xl' })}
	<button
		type="button"
		onclick={() => {
			screenView = view;
			onScreenSizeClick?.();
		}}
		class="w-min hover:brightness-150 {screenView === view
			? 'transition-colors [&>*]:stroke-warning-500'
			: ''}"
	>
		{#if view === 'sm'}
			<SmartphoneIcon />
		{:else if view === 'lg'}
			<TabletIcon />
		{:else if view === 'xl'}
			<LaptopIcon />
		{/if}
	</button>
{/snippet}
