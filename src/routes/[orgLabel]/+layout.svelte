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
	import { page } from '$app/state';

	let { data, children } = $props();

	setFormMsgStore();
	setDrawerStore({ isOpen: false });
	setModalStore();
	setUser({
		user: { ...data.user, orgLabel: data.org.label },
		clients: data.usersClients,
		services: []
	});
	let userMenuOpen = $state(false);

	function onUserAvatarClick() {
		userMenuOpen = !userMenuOpen;
	}
</script>

<Drawer />
<Modal />
<div
	class="grid h-full min-h-screen w-full max-w-full grid-cols-[auto_1fr] grid-rows-[auto_1fr] items-start overflow-hidden"
>
	<div class="relative z-20 col-span-2 h-14">
		<div class="fixed flex h-14 w-full place-items-center justify-between bg-surface-500 px-5">
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
	</div>
	<div class="relative z-20 flex h-full min-h-full w-24">
		<nav
			in:fade
			class="bg-surface-100-800-token border-surface-500-400-token fixed grid h-full w-fit auto-rows-min grid-cols-1 items-start gap-y-1 border-b border-r border-t [&>.btn]:rounded-none"
		>
			<SidebarAnchor href={route('/[orgLabel]/clients', { orgLabel: data.org.label })}>
				<img src="/FolderUser.png" alt="icon" />
				<span>Clients</span>
			</SidebarAnchor>
			<SidebarAnchor href={route('/[orgLabel]/services', { orgLabel: data.org.label })}>
				<img src="/Buildings.png" alt="icon" />
				<span>Services</span>
			</SidebarAnchor>
		</nav>
	</div>
	<div class="relative flex h-full w-full overflow-y-auto">
		{@render children()}
	</div>
</div>
