<script lang="ts">
	import { setDrawerStore } from '$lib/components/drawer/context.svelte.js';
	import { Drawer } from '$lib/components/drawer';
	import { setFormMsgStore } from '$lib/components/forms';
	import { NavBarSearch } from '$lib/components/nav-bar-search';
	import { setUser, UserAvatar, UserMenu } from '$lib/components/user';

	let { data, children } = $props();
	let userMenuOpen = $state(false);
	setUser(data.user);

	function onUserAvatarClick() {
		userMenuOpen = !userMenuOpen;
	}
	setFormMsgStore();
	setDrawerStore({ isOpen: false });
</script>

<Drawer />
<div class="h-screen w-screen overflow-hidden">
	<div class="flex h-14 w-full place-items-center justify-between bg-surface-500 px-8">
		<span class="h3 font-bold">HIFIS</span>
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
	<div class="flex h-full w-full flex-col overflow-y-auto">
		{@render children()}
	</div>
</div>
