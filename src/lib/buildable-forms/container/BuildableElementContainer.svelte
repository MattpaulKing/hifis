<script lang="ts">
	import { bounds, BoundsFrom, Compartment, draggable, events, grid, position, scrollLock } from "@neodrag/svelte";
	import { BuildableElementMenu, getBuildableGridController } from "$lib/buildable-forms";
	import type { Snippet } from "svelte";
	import type { ELEMENT_TYPES } from "$routes/[orgLabel]/custom-entities/schema/entityFields";

  type Props = { pos: { x: number, y: number }; idx: number; elementType: keyof typeof ELEMENT_TYPES; boundingElement: HTMLElement, eventHandlers?: Parameters<typeof events>[0], class?: string, children: Snippet }
  let { pos = $bindable(), idx, elementType, boundingElement, eventHandlers, class: classes, children }: Props = $props()

  let controller = getBuildableGridController()

  const positionComp = Compartment.of(() => position({ default: { ...pos}, current: pos }))
  const eventsComp = Compartment.of(() => events({
    onDragStart(data) {
      eventHandlers?.onDragStart?.(data)
    },
    onDrag(data) {
      controller.setDragIdx({ elementType, idx })
      eventHandlers?.onDrag?.(data)
    },
    onDragEnd(data) {
      eventHandlers?.onDragEnd?.(data)
    },
  }))
  const gridComp = Compartment.of(() => grid([controller.gridSize, controller.gridSize]))
  const boundsComp = Compartment.of(() => bounds(BoundsFrom.element(boundingElement)))

  let itemId = $derived(controller.items[elementType][idx].properties.id)
</script>

<div {@attach draggable(() => [
  positionComp,
  eventsComp,
  gridComp,
  boundsComp,
  scrollLock({ lockAxis: 'x' })
  ])} 
  onclick={() => controller.setMenu({ elementType, idx })}
  onkeydown={(e) => {
    if (e.key === "Enter" || e.key === "Space") {
      controller.setMenu({ elementType, idx })
    }
  }}
  role="gridcell"
  tabindex="0"
  class="{classes} border border-dashed {itemId in controller.items[elementType] ? 'border-warning-300-600-token' : itemId === controller.menu.fieldId || itemId === controller.menu.blockId ? 'border-primary-300-600-token' : 'border-surface-300-600-token'} group absolute cursor-move overflow-hidden p-1 transition-transform rounded-token [&>div>input]:cursor-default [&>div>label]:cursor-move [&>div]:cursor-move">
  <BuildableElementMenu
		onDelete={() =>
			controller.handleDelete({ elementType, i: idx
    })}
					/>
  {@render children()}
</div>
