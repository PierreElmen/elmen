<script lang="ts">
	import { layoutState } from '$lib/stores/layoutStore.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { TechStack } from '$lib/components';

	const gameLineup = [
		{
			title: 'Asteroids Redux',
			status: 'Now playing',
			description: 'Arrow keys to steer, Space to fire. Q / Esc to exit.',
			ready: true,
			href: '/games/asteroids'
		},
		{
			title: 'Retro Snake',
			status: 'New',
			description: 'Arrows or WASD to slither. Walls are deadly.',
			ready: true,
			href: '/games/snake'
		},
		{
			title: 'Pong Duel',
			status: 'New',
			description: 'Head-to-head with keyboard support.',
			ready: true,
			href: '/games/pong'
		}
	];

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
		contact: { title: 'Contact', body: 'Reach out to me at hello@example.com' },
		'game-shelf': { title: 'Game Shelf', body: 'Select a cabinet to launch.' }
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
					class="p-2 text-sm text-[var(--color-retro-muted)] transition-colors hover:text-[var(--color-text-main)]"
					aria-label="Close"
				>
					[ESC]
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
				{:else if layoutState.activeModalId === 'game-shelf'}
					<div class="mt-6 space-y-3">
						{#each gameLineup as game}
							<div class="border border-[var(--color-border)] bg-[var(--color-bg-main)] p-3">
								<div class="flex items-center justify-between">
									<div class="font-mono text-sm tracking-widest uppercase">{game.title}</div>
									<span
										class="rounded px-2 py-1 text-[10px] uppercase {game.ready
											? 'border border-[var(--color-border)] text-[var(--color-text-main)]'
											: 'border border-dashed border-[var(--color-border)] text-[var(--color-retro-muted)]'}"
									>
										{game.status}
									</span>
								</div>
								<p class="mt-1 text-xs text-[var(--color-retro-muted)]">{game.description}</p>

								{#if game.ready && game.href}
									<a
										href={game.href}
										class="mt-3 inline-flex items-center gap-2 border border-[var(--color-border)] bg-[var(--color-bg-main)] px-3 py-2 text-[11px] tracking-widest uppercase transition-colors hover:bg-[var(--color-retro-nav)]"
										onclick={() => layoutState.closeModal()}
									>
										<span>Play</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"><path d="m7 7 10 10" /><path d="M17 7v10H7" /></svg
										>
									</a>
								{:else}
									<div
										class="mt-3 inline-flex items-center gap-2 border border-dashed border-[var(--color-border)] px-3 py-2 text-[11px] tracking-widest text-[var(--color-retro-muted)] uppercase"
									>
										Coming soon
									</div>
								{/if}
							</div>
						{/each}
					</div>

					<div
						class="mt-6 border-t border-[var(--color-border)] pt-3 text-[11px] text-[var(--color-retro-muted)]"
					>
						Plan: wire a shared highscore service so every cabinet reports wins + streaks. Until
						then, scores stay local.
					</div>
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
