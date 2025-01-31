<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { getModalStore } from './context';

	let modals = getModalStore();
	function closeModal() {
		modals.queue[modals.showingIdx].response({ type: 'close' });
		pushState(modals.queue[modals.showingIdx].routes.from, $page.data);
		modals.close();
	}
</script>

<button type="button" onclick={closeModal} class="btn variant-ghost">Cancel</button>
