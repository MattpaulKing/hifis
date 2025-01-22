<script lang="ts">
	interface Props {
		btnType?: 'button' | 'submit';
		onclick?: (e: MouseEvent) => void;
		children: import('svelte').Snippet;
		icon?: import('svelte').Snippet;
	}

	let { btnType = 'submit', onclick, icon, children }: Props = $props();
</script>

<li class="w-full">
	<button
		type={btnType}
		{onclick}
		class="btn flex h-min w-full justify-start hover:bg-surface-hover-token"
	>
		{@render icon?.()}
		{@render children()}
	</button>
</li>
