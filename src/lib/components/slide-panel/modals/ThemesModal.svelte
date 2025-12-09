<script lang="ts">
	import { layoutState } from '$lib/stores/layoutStore.svelte';

	const themes = [
		{
			id: 'beige',
			name: 'Retro Beige',
			description: 'Classic terminal feel',
			preview: { bg: '#f3eadb', border: '#2a2a2a' }
		},
		{
			id: 'orange',
			name: 'Cyber Orange',
			description: 'High contrast amber',
			preview: { bg: '#050505', border: '#ff9900' }
		},
		{
			id: 'green',
			name: 'Matrix Green',
			description: 'System code',
			preview: { bg: '#020a02', border: '#00ff41' }
		},
		{
			id: 'black',
			name: 'Monochrome',
			description: 'Minimalist dark',
			preview: { bg: '#000000', border: '#ffffff' }
		},
		{
			id: 'rgb',
			name: 'Trinitron RGB',
			description: 'High-res phosphor',
			preview: { bg: '#0a0a0c', border: '#00ffff' }
		}
	] as const;
</script>

<div class="mt-8 grid grid-cols-1 gap-4">
	{#each themes as theme}
		<button
			class="group flex items-center gap-4 border border-[var(--color-border)] p-4 text-left transition-colors hover:bg-[var(--color-bg-main)]"
			onclick={() => layoutState.setTheme(theme.id)}
		>
			<div
				class="h-8 w-8 border"
				style="background-color: {theme.preview.bg}; border-color: {theme.preview.border};"
			></div>
			<div>
				<div class="font-bold">{theme.name}</div>
				<div class="text-xs text-[var(--color-retro-muted)]">{theme.description}</div>
			</div>
		</button>
	{/each}
</div>
