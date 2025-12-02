<script lang="ts">
	import { layoutState } from '$lib/stores/layoutStore.svelte';
	import { clickable } from '$lib/actions/clickable';

	// Simple inline icons to avoid dependency issues for now
	const icons = {
		home: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
		user: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
		code: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
		mail: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
		layers: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>`,
		palette: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
		gamepad: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h4"/><path d="M8 10v4"/><path d="M15 13h.01"/><path d="M18 11h.01"/><rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 20v-2"/><path d="M18 20v-2"/></svg>`
	};

	const navItems = [
		{ id: 'about', label: 'About', icon: icons.user },
		{ id: 'projects', label: 'Projects', icon: icons.code },
		{ id: 'stack', label: 'Stack', icon: icons.layers },
		{ id: 'themes', label: 'Themes', icon: icons.palette },
		{ id: 'contact', label: 'Contact', icon: icons.mail },
		{ id: 'game-shelf', label: 'Games', icon: icons.gamepad }
	];
</script>

<nav
	class="pixel-border-r fixed top-0 left-0 z-50 flex h-full w-[var(--nav-width)] flex-col bg-[var(--color-retro-nav)]"
>
	<!-- Logo / Home -->
	<a
		href="/"
		class="flex h-[var(--nav-width)] w-full items-center justify-center border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-main)] hover:text-[var(--color-accent)]"
		aria-label="Home"
		use:clickable
	>
		{@html icons.home}
	</a>

	<!-- Nav Items -->
	<div class="flex w-full flex-col">
		{#each navItems as item}
			<button
				class="group relative flex h-[var(--nav-width)] w-full items-center justify-center border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-main)]
                {layoutState.activeModalId === item.id
					? 'bg-[var(--color-bg-main)] text-[var(--color-accent)]'
					: ''}"
				onclick={() => layoutState.toggleModal(item.id)}
				aria-label={item.label}
				use:clickable
			>
				<div class="h-6 w-6">
					{@html item.icon}
				</div>

				<!-- Tooltip / Label (Desktop) -->
				<span
					class="pointer-events-none absolute left-full z-50 ml-2 rounded bg-[var(--color-text-main)] px-2 py-1 text-xs whitespace-nowrap text-[var(--color-bg-main)] opacity-0 transition-opacity group-hover:opacity-100"
				>
					{item.label}
				</span>

				<!-- Active Indicator -->
				{#if layoutState.activeModalId === item.id}
					<div class="absolute top-0 bottom-0 left-0 w-1 bg-[var(--color-accent)]"></div>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Bottom / Settings or Socials could go here -->
	<div class="mt-auto mb-4 flex justify-center">
		<div class="-rotate-90 font-mono text-[10px] whitespace-nowrap text-[var(--color-retro-muted)]">
			v1.0.0
		</div>
	</div>
</nav>
