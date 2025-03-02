<script lang="ts">
	import { page } from '$app/state';
	import { getModalStore, openModal } from '../modal';
	import type { Snippet } from 'svelte';
	import type { Modal, ModalResponse } from '../modal/store.svelte';
	let {
		class: classes,
		href,
		ref,
		children,
		onCreate
	}: {
		class?: string;
		href: string;
		ref: Modal['ref'];
		children: Snippet;
		onCreate?: (e: ModalResponse | undefined) => void;
	} = $props();
	let modalStore = getModalStore();
</script>

<a
	onclick={async (e) => {
		e.preventDefault();
		openModal({
			routes: {
				from: page.url.toString(),
				to: href
			},
			ref,
			modalStore
		}).then(onCreate);
	}}
	{href}
	class="{classes} btn-icon btn-icon-sm h-7 w-7 place-self-end
      justify-self-end transition-colors rounded-token"
>
	{@render children()}
</a>
