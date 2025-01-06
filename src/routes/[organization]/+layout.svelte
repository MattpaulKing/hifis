<script lang="ts">
	import { setFormMsgStore } from '$lib/components/forms';

	let { children } = $props();

	setFormMsgStore();
</script>

{@render children()}
