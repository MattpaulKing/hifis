<script lang="ts">
	import { setDrawerStore } from '$lib/components/drawer/context.svelte.js';
	import { Drawer } from '$lib/components/drawer';
	import { setFormMsgStore } from '$lib/components/forms';
	import { NavBarSearch } from '$lib/components/nav-bar-search';
	import { setUser, UserAvatar, UserMenu } from '$lib/components/user';
	import { Modal, setModalStore } from '$lib/components/modal';
	import { route } from '$src/lib/ROUTES';
	import { fade } from 'svelte/transition';
	import SidebarAnchor from '$src/lib/components/sidebar/SidebarAnchor.svelte';

	let { data, children } = $props();

	setFormMsgStore();
	setDrawerStore({ isOpen: false });
	setModalStore();
	setUser({ ...data.user, orgLabel: data.org.label });
	let userMenuOpen = $state(false);

	function onUserAvatarClick() {
		userMenuOpen = !userMenuOpen;
	}
</script>

<Drawer />
<Modal />
<div class="h-screen w-screen overflow-hidden">
	<div class="col-span-2 flex h-14 w-full place-items-center justify-between bg-surface-500 px-5">
		<a href={route('/[orgLabel]', { orgLabel: data.org.label })} class="h3 font-bold">HIFIS</a>
		<div>
			<NavBarSearch></NavBarSearch>
		</div>
		<div class="relative">
			<UserAvatar onclick={onUserAvatarClick}></UserAvatar>
			{#if userMenuOpen}
				<UserMenu></UserMenu>
			{/if}
		</div>
	</div>
	<div class="grid h-full w-full grid-cols-[auto_1fr]">
		<nav
			in:fade
			class="sticky grid h-full w-fit grid-cols-1 items-start bg-surface-700 [&>.btn]:rounded-none"
		>
			<SidebarAnchor href={route('/[orgLabel]/clients', { orgLabel: data.org.label })}>
				<img src="/FolderUser.png" alt="client-folder" />
				<span>Clients</span>
			</SidebarAnchor>
		</nav>
		{@render children()}
	</div>
</div>
