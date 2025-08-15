<script lang="ts">
	let { label }: { label: string } = $props();
</script>

<div class="col-span-2 mb-4 flex flex-col">
	<span class="col-span-2 my-2 px-2">{label}</span>
	<hr class="divider border-surface-500-400-token mt-1" />
</div>
