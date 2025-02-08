<script lang="ts">
	import { getUser } from './userContext.svelte';

	type Props = { onclick?: (e: MouseEvent) => void };
	let { onclick }: Props = $props();
	let user = getUser();
	let initials = user.properties.firstName[0].concat(user.properties.lastName[0]);
</script>

<button
	{onclick}
	class="variant-filled-primary btn btn-sm {!onclick
		? 'brightness-100!'
		: ''}  h-8 w-8 rounded-full font-bold hover:text-surface-200-700-token"
>
	{initials}
</button>
