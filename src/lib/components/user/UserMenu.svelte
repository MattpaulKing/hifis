<script lang="ts">
	import { getUser } from '.';
	import { UserAvatar } from '.';
	let user = getUser();
</script>

<div class="relative z-50">
	<div class="card absolute right-0 flex w-fit min-w-64 flex-col gap-y-3 p-4">
		<div class="flex place-items-center gap-x-4">
			<UserAvatar />
			<div class="flex flex-col">
				<div class="flex gap-x-1">
					<span>{user.properties.firstName}</span>
					<span>{user.properties.lastName}</span>
				</div>
			</div>
		</div>
		<hr />
		<nav class="list-nav">
			<ul>
				<li class="group relative">
					<a class="flex w-full" href="/settings">
						<img width="24" height="24" src="/Gear.png" class="dark:invert" alt="gear" />
						<span>Settings</span>
					</a>
				</li>
				<hr />
			</ul>
		</nav>
	</div>
</div>
