<script lang="ts">
  import { draggable, grid, bounds, BoundsFrom } from "@neodrag/svelte"
	import type { BuildableFieldDefault } from "../fields";
  let { elements }: { elements: BuildableFieldDefault[] } = $props()
</script>


<div class="mb-4 grid auto-cols-max grid-cols-2 gap-2">
		{#each Object.values(elements) as field}
			{@const Icon = field.component.icon}
			<button {@attach draggable([
    grid([20, 20]),
    bounds(BoundsFrom.viewport())
  ])}
	draggable={true}
	class="variant-ghost border-surface-500-400-token btn h-full max-w-36 border"
>
				<span class="rounded-token">
					<Icon size={20} />
				</span>
				<span class="whitespace-break-spaces">{field.component.title}</span>
			</button>
		{/each}
	</div>

