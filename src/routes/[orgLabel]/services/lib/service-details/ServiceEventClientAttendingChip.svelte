<script lang="ts">
	import { enhance } from '$app/forms';
	import { getUser } from '$src/lib/components/user';
	import { route } from '$src/lib/ROUTES';

	type Props = {
		clientId: string;
		clientLabel: string;
		serviceEventId: string;
		onDelete: () => void;
	};
	let { clientId, clientLabel, serviceEventId, onDelete }: Props = $props();
	let user = getUser();
</script>

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
		class="variant-filled btn btn-sm relative px-3 py-1 hover:variant-filled-error disabled:cursor-not-allowed"
	>
		<span class="w-fit px-1">{clientLabel}</span>
		<span class="absolute -top-1 right-1">x</span>
	</button>
</form>
