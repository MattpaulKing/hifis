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
	class={classes}
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
	<path in:drawIn out:drawOut d="M13 13H8a1 1 0 0 0-1 1v7" /><path d="M14 8h1" /><path
		d="M17 21v-4"
	/><path d="m2 2 20 20" />
	<path
		in:drawIn
		out:drawOut
		d="M20.41 20.41A2 2 0 0 1 19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 .59-1.41"
	/>
	<path in:drawIn out:drawOut d="M29.5 11.5s5 5 4 5" /><path
		d="M9 3h6.2a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V15"
	/></svg
>
