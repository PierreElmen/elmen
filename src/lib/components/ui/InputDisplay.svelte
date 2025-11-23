<script lang="ts">
	import { navigationState } from '$lib/stores/navigationStore.svelte';
	import { fade } from 'svelte/transition';
</script>

{#if navigationState.input}
	<div
		class="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center"
		transition:fade={{ duration: 100 }}
	>
		<div
			class="flex h-24 w-24 items-center justify-center border border-[var(--color-border)] bg-[var(--color-bg-main)] text-4xl font-bold text-[var(--color-text-main)] shadow-[0_0_20px_var(--color-glow)]"
		>
			{navigationState.input}
		</div>
	</div>
{/if}
