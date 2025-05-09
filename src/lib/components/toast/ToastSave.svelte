<script lang="ts">
	import { SaveIcon } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { type IToast } from './toastState.svelte';

	let { toast, children }: { toast: IToast; children?: Snippet } = $props();
</script>

<div class="flex place-items-center gap-x-3">
	<span class="badge p-1">
		<SaveIcon class="stroke-success-500" />
	</span>
	<span class="">{toast.message}</span>
	{@render children?.()}
</div>
