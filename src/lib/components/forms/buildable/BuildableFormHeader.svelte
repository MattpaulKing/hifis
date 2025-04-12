<script lang="ts">
	import { SaveIcon } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	let {
		published,
		class: classes,
		children,
		onSave,
		onPublishClick
	}: {
		published: boolean | null | undefined;
		class?: string;
		children: Snippet;
		onSave?: () => Promise<void>;
		onPublishClick?: () => Promise<void>;
	} = $props();
</script>

<div class="grid h-fit w-full grid-cols-[1fr_auto] place-items-start {classes}">
	{@render children()}
	<div class="mt-4 flex h-fit w-fit place-items-center gap-x-4 self-center">
		{#key published}
			<button
				in:fade
				type="button"
				onclick={async () => await onPublishClick?.()}
				class="btn h-9 font-bold transition-all rounded-token hover:brightness-125 {published
					? 'variant-filled'
					: 'border-surface-600-300-token border'}"
			>
				{#if published}
					Published
				{:else}
					Draft
				{/if}
			</button>
		{/key}
		<button
			type="button"
			onclick={async () => await onSave?.()}
			class="group variant-filled-success btn-icon h-9 rounded-token"
		>
			<SaveIcon strokeWidth="2px" class="h-7 w-7"></SaveIcon>
		</button>
	</div>
</div>
