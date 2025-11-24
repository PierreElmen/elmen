<script lang="ts">
	import { layoutState } from '$lib/stores/layoutStore.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import TechStack from '$lib/components/bento/TechStack.svelte';

	// Content mapping (placeholder for now)
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
		contact: { title: 'Contact', body: 'Reach out to me at hello@example.com' }
	};

	let activeContent = $derived(
		layoutState.activeModalId ? contentMap[layoutState.activeModalId] : null
	);
</script>

{#if layoutState.isModalOpen && activeContent}
	<!-- Backdrop (optional, maybe just for mobile) -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-30 bg-black/20 md:hidden"
		onclick={() => layoutState.closeModal()}
	></div>

	<!-- Panel -->
	<aside
		class="pixel-border-r fixed top-0 bottom-0 left-[var(--nav-width)] z-40 w-[calc(100%-var(--nav-width))] overflow-y-auto bg-[var(--color-retro-card)] shadow-xl md:w-[var(--modal-width)]"
		transition:fly={{ x: -100, duration: 400, easing: quintOut }}
	>
		<div class="flex h-full flex-col p-8">
			<div class="mb-8 flex items-start justify-between">
				<h2 class="font-mono text-2xl font-bold tracking-tight uppercase">{activeContent.title}</h2>
				<button
					onclick={() => layoutState.closeModal()}
					class="rounded-full p-2 transition-colors hover:bg-[var(--color-bg-main)]"
					aria-label="Close"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
					>
				</button>
			</div>

			<div class="prose prose-stone prose-sm max-w-none font-mono">
				<p>{activeContent.body}</p>

				{#if layoutState.activeModalId === 'themes'}
					<div class="mt-8 grid grid-cols-1 gap-4">
						<button
							class="group flex items-center gap-4 border border-[var(--color-border)] p-4 text-left transition-colors hover:bg-[var(--color-bg-main)]"
							onclick={() => layoutState.setTheme('beige')}
						>
							<div class="h-8 w-8 border border-[#2a2a2a] bg-[#f3eadb]"></div>
							<div>
								<div class="font-bold">Retro Beige</div>
								<div class="text-xs text-[var(--color-retro-muted)]">Classic terminal feel</div>
							</div>
						</button>

						<button
							class="group flex items-center gap-4 border border-[var(--color-border)] p-4 text-left transition-colors hover:bg-[var(--color-bg-main)]"
							onclick={() => layoutState.setTheme('orange')}
						>
							<div class="h-8 w-8 border border-[#ff9900] bg-[#050505]"></div>
							<div>
								<div class="font-bold">Cyber Orange</div>
								<div class="text-xs text-[var(--color-retro-muted)]">High contrast amber</div>
							</div>
						</button>

						<button
							class="group flex items-center gap-4 border border-[var(--color-border)] p-4 text-left transition-colors hover:bg-[var(--color-bg-main)]"
							onclick={() => layoutState.setTheme('green')}
						>
							<div class="h-8 w-8 border border-[#00ff41] bg-[#020a02]"></div>
							<div>
								<div class="font-bold">Matrix Green</div>
								<div class="text-xs text-[var(--color-retro-muted)]">System code</div>
							</div>
						</button>

						<button
							class="group flex items-center gap-4 border border-[var(--color-border)] p-4 text-left transition-colors hover:bg-[var(--color-bg-main)]"
							onclick={() => layoutState.setTheme('black')}
						>
							<div class="h-8 w-8 border border-[#ffffff] bg-[#000000]"></div>
							<div>
								<div class="font-bold">Monochrome</div>
								<div class="text-xs text-[var(--color-retro-muted)]">Minimalist dark</div>
							</div>
						</button>
					</div>
				{:else if layoutState.activeModalId === 'stack'}
					<TechStack mode="full" />
				{:else}
					<div
						class="mt-8 border border-dashed border-[var(--color-border)] bg-[var(--color-bg-main)] p-4"
					>
						<p class="text-xs text-[var(--color-retro-muted)]">
							Placeholder content area for {layoutState.activeModalId}
						</p>
					</div>
				{/if}
			</div>

			<div
				class="mt-auto border-t border-[var(--color-border)] pt-8 text-xs text-[var(--color-retro-muted)]"
			>
				PRESS [ESC] TO CLOSE
			</div>
		</div>
	</aside>
{/if}
