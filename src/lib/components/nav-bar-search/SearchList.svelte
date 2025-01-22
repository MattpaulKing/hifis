<script lang="ts">
	interface Props {
		title?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let { ...props }: Props = $props();
</script>

<div
	role="menu"
	class="{props.class} card ring-surface-100-800-token -top-2 z-50 h-fit w-full min-w-64 space-y-4 p-4 shadow-lg ring-1 hover:bg-surface-100-800-token dark:shadow-surface-800"
>
	<div class="px-2">
		{@render props.title?.()}
	</div>
	<div class="h-fit max-h-80 w-full overflow-y-auto">
		<ul class="space-y-2">
			{@render props.children?.()}
		</ul>
		<div class="bg-surface-backdrop-token arrow"></div>
	</div>
</div>
