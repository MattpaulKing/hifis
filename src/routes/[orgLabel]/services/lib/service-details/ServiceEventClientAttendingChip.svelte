<script lang="ts">
	import { enhance } from '$app/forms';
	import { getUser } from '$src/lib/components/user';
	import { route } from '$src/lib/ROUTES';
	import { slide } from 'svelte/transition';

	type Props = {
		clientId: string;
		clientLabel: string;
		serviceEventId: string;
		onDelete: () => void;
	};
	let { clientId, clientLabel, serviceEventId, onDelete }: Props = $props();
	let user = getUser();
	let deleted = $state(false);
	function slideOnDelete(node: Element) {
		if (deleted) {
			return slide(node);
		}
		return {};
	}
</script>

<li out:slideOnDelete class="grid grid-cols-[1fr_auto] items-center gap-x-3">
	<form
		method="POST"
		action={route('default /[orgLabel]/services/events/clients/[action=crud]', {
			orgLabel: user.properties.orgLabel,
			action: 'delete'
		})}
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					onDelete();
				}
			};
		}}
	>
		<input type="hidden" name="serviceEventId" value={serviceEventId} />
		<input type="hidden" name="clientId" value={clientId} />
		<button
			type="submit"
			onclick={() => (deleted = true)}
			class="variant-filled btn btn-sm relative px-3 py-1 hover:variant-filled-error disabled:cursor-not-allowed"
		>
			<span class="w-fit px-1">{clientLabel}</span>
			<span class="absolute -top-1 right-1">x</span>
		</button>
	</form>
</li>
