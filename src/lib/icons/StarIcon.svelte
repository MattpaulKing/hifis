<script lang="ts">
	import { draw, type DrawParams, type TransitionConfig } from 'svelte/transition';

	let {
		transitions = { in: undefined, out: undefined },
		class: classes
	}: {
		transitions?: { in?: DrawParams | undefined; out?: DrawParams | undefined };
		class?: string;
	} = $props();

	function drawIn(
		node: SVGElement & {
			getTotalLength(): number;
		}
	): TransitionConfig {
		if (transitions.in) {
			return draw(node, transitions.in);
		}
		return draw(node, { duration: 0 });
	}
	function drawOut(
		node: SVGElement & {
			getTotalLength(): number;
		}
	): TransitionConfig {
		if (transitions.out) {
			return draw(node, transitions.out);
		}
		return draw(node, { duration: 0 });
	}
</script>

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
	class="{classes} "
	><path
		in:drawIn
		out:drawOut
		d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
	/></svg
>
