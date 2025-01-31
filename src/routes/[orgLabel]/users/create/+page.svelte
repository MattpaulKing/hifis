<script lang="ts">
	import { initForm } from '$lib/components/forms/index.js';
	import { UserForm } from '../lib';
	import { usersFormSchema } from '../schema';

	let { data } = $props();
	let form = initForm({
		form: data.userForm,
		schema: usersFormSchema,
		opts: {
			resetForm: true
		}
	});
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<UserForm
		{form}
		lookups={data.lookups}
		action={{
			path: 'default /[orgLabel]/users/create',
			params: { orgLabel: data.orgLabel }
		}}
		crud="create"
	></UserForm>
</div>
