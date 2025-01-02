<script lang="ts">
	let { class: classes }: { class?: string } = $props();
</script>

<div class="absolute z-50 flex h-full w-full flex-col items-center justify-center">
	<div
		class="loader relative animate-spin rounded-full duration-[infinite] ease-linear
      before:absolute before:inset-0 before:animate-[spin]
      before:rounded-full before:border-4 before:duration-[infinite] before:ease-linear {classes ??
			'h-10 w-10'} aspect-square"
	></div>
	<div class="bg-surface-50-900-token absolute h-full w-full opacity-25"></div>
</div>

<style>
	.loader::before {
		content: '';
		box-sizing: border-box;
		position: absolute;
		inset: 0px;
		border-radius: 50%;
		border: 5px solid rgb(15, 186, 129);
		animation: spin 2s linear infinite;
		opacity: 1 !important;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes spin {
		0% {
			clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
		}
		25% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
		}
		50% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
		}
		75% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
		}
		100% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
		}
	}
</style>
