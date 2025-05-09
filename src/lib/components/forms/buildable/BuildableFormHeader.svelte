<script lang="ts">
	import { LaptopIcon, ShieldAlertIcon, SmartphoneIcon, TabletIcon } from '@lucide/svelte';
	import { draw, fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	let {
		published,
		screenView = $bindable(),
		taintedInputFieldsExist,
		class: classes,
		children,
		onSave,
		onPublishClick
	}: {
		published: boolean | null | undefined;
		screenView: string;
		taintedInputFieldsExist: boolean;
		class?: string;
		children: Snippet;
		onSave?: () => void;
		onPublishClick?: () => void;
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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="{published ? 'fill-none stroke-warning-500' : 'stroke-surface-100'} "
					><path
						in:draw
						d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
					/></svg
				>
			{/key}
			{#if published}
				<span in:fade>Published</span>
			{:else}
				<span class="ml-2" in:fade>Draft</span>
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
			class="group {taintedInputFieldsExist
				? 'variant-filled-warning transition-colors hover:variant-filled-success'
				: 'variant-filled-success'} btn-icon h-9 rounded-token"
		>
			{#if taintedInputFieldsExist && !hoveringSave}
				<svg
					class="h-7 w-7"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path in:draw d="M13 13H8a1 1 0 0 0-1 1v7" /><path d="M14 8h1" /><path
						d="M17 21v-4"
					/><path d="m2 2 20 20" />
					<path in:draw d="M20.41 20.41A2 2 0 0 1 19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 .59-1.41" />
					<path in:draw d="M29.5 11.5s5 5 4 5" /><path
						d="M9 3h6.2a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V15"
					/></svg
				>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-7 w-7"
					><path
						in:draw
						d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
					/><path in:draw d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" /><path
						d="M7 3v4a1 1 0 0 0 1 1h7"
					/></svg
				>
			{/if}
		</button>
		{#if hoveringSave && taintedInputFieldsExist}
			<div class="card absolute right-0 top-full mt-2 flex w-64 place-items-start gap-x-4 p-6">
				<span class="badge-icon h-16 w-16">
					<ShieldAlertIcon class="h-full w-full stroke-error-500" />
				</span>
				<span>There are fields that have not been saved yet.</span>
			</div>
		{/if}
	</div>
</div>
{#snippet viewButton({ view }: { view: 'sm' | 'lg' | 'xl' })}
	<button
		type="button"
		onclick={() => {
			screenView = view;
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
