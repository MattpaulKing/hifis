<script lang="ts">
	import { TrashIcon } from '@lucide/svelte';
	let { onDelete }: { onDelete: () => void } = $props();
</script>

<div class="flex h-fit w-full justify-end">
	<button
		onclick={(e) => {
			e.stopImmediatePropagation();
			onDelete();
		}}
		class="variant-ghost btn-icon btn-icon-sm transition-colors rounded-token hover:variant-filled-error"
	>
		<TrashIcon />
	</button>
</div>
