<script lang="ts">
	import { layoutState } from '$lib/stores/layoutStore.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import {
		ThemesModal,
		GameShelfModal,
		ContactModal,
		StackModal,
		PlaceholderModal
	} from './modals';

	const contentMap: Record<string, { title: string; body: string }> = {
		about: {
			title: 'About Me',
			body: 'I am a creative developer focused on building digital gardens and interactive experiences.'
		},
		projects: {
			title: 'Projects',
			body: 'Here are some of the things I have been working on recently.'
		},
		stack: { title: 'Tech Stack', body: '' },
		themes: { title: 'Appearance', body: 'Select a theme to customize your experience.' },
		contact: { title: 'Contact', body: 'Reach out to me at hello@example.com' },
		'game-shelf': { title: 'Game Shelf', body: 'Select a cabinet to launch.' }
	};

	const activeContent = $derived(
		layoutState.activeModalId ? contentMap[layoutState.activeModalId] : null
	);
</script>

{#if layoutState.isModalOpen && activeContent}
	<!-- Backdrop (mobile only) -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-30 bg-black/20 md:hidden"
		onclick={() => layoutState.closeModal()}
	></div>

	<!-- Panel -->
	<aside
		class="pixel-border-r fixed top-[16px] bottom-[16px] left-[calc(var(--nav-width)+16px)] z-40 flex w-[calc(100%-var(--nav-width)-32px)] flex-col overflow-y-auto bg-[var(--color-retro-card)] shadow-xl md:w-[var(--modal-width)]"
		transition:fly={{ x: -100, duration: 400, easing: quintOut }}
	>
		<div class="flex h-full flex-col p-8">
			<!-- Header -->
			<div class="mb-8 flex items-start justify-between">
				<h2 class="font-mono text-2xl font-bold tracking-tight uppercase">
					{activeContent.title}
				</h2>
				<button
					onclick={() => layoutState.closeModal()}
					class="p-2 text-sm text-[var(--color-retro-muted)] transition-colors hover:text-[var(--color-text-main)]"
					aria-label="Close"
				>
					[ESC]
				</button>
			</div>

			<!-- Content -->
			<div class="prose prose-stone prose-sm flex max-w-none flex-1 flex-col font-mono">
				{#if activeContent.body}
					<p>{activeContent.body}</p>
				{/if}

				{#if layoutState.activeModalId === 'themes'}
					<ThemesModal />
				{:else if layoutState.activeModalId === 'stack'}
					<StackModal />
				{:else if layoutState.activeModalId === 'game-shelf'}
					<GameShelfModal />
				{:else if layoutState.activeModalId === 'contact'}
					<ContactModal />
				{:else}
					<PlaceholderModal modalId={layoutState.activeModalId ?? ''} />
				{/if}
			</div>

			<!-- Footer -->
			<div
				class="mt-auto border-t border-[var(--color-border)] pt-8 text-xs text-[var(--color-retro-muted)]"
			>
				PRESS [ESC] TO CLOSE
			</div>
		</div>
	</aside>
{/if}
