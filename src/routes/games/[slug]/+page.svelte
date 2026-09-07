<script lang="ts">
	import type { PageData } from './$types';
	import { AsteroidsGame, SnakeGame, PongGame } from '$lib/components';

	type GameOption = {
		slug: string;
		label: string;
		tagline: string;
		component: typeof AsteroidsGame | typeof SnakeGame | typeof PongGame;
	};

	const gameList: GameOption[] = [
		{
			slug: 'asteroids',
			label: 'Asteroids',
			tagline: 'Arrow keys steer // Space to fire // Q or Esc exits',
			component: AsteroidsGame
		},
		{
			slug: 'snake',
			label: 'Snake',
			tagline: 'Arrows or WASD steer // Walls are deadly // Q or Esc exits',
			component: SnakeGame
		},
		{
			slug: 'pong',
			label: 'Pong Duel',
			tagline: 'P1: W/S // P2: UP/DOWN // First to 10 wins',
			component: PongGame
		}
	];

	const gameMap = gameList.reduce(
		(map, game) => {
			map[game.slug] = game;
			return map;
		},
		{} as Record<string, GameOption>
	);

	let { data }: { data: PageData } = $props();
	let activeSlug = $state(data.slug);
	let activeGame = $state(gameMap[activeSlug] ?? gameList[0]);

	$effect(() => {
		activeSlug = data.slug;
		activeGame = gameMap[activeSlug] ?? gameList[0];
	});
</script>

<div class="flex h-full min-h-0 min-w-0 flex-col overflow-hidden px-2 py-4 md:px-4">
	<div
		class="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-3"
	>
		<div class="flex items-center gap-3">
			<div
				class="grid h-9 w-9 place-items-center border border-[var(--color-border)] bg-[var(--color-retro-card)]"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>
			</div>
			<div>
				<h1 class="font-mono text-lg tracking-widest uppercase">Arcade / {activeGame.label}</h1>
				<p class="text-xs text-[var(--color-retro-muted)]">
					{activeGame.tagline}
				</p>
			</div>
		</div>
		<div class="font-mono text-xs text-[var(--color-retro-muted)]">
			Cursor control will be captured while a game is running.
		</div>
	</div>

	<div
		class="mb-3 flex flex-wrap items-center justify-between gap-2 rounded border border-[var(--color-border)] bg-[var(--color-bg-main)] px-3 py-2"
	>
		<div class="flex flex-wrap gap-2">
			{#each gameList as game}
				<a
					href={`/games/${game.slug}`}
					class={`border border-[var(--color-border)] px-3 py-1 font-mono text-[11px] tracking-widest uppercase transition-colors ${
						activeSlug === game.slug
							? 'bg-[var(--color-retro-nav)] text-[var(--color-text-main)]'
							: 'bg-[var(--color-bg-main)] text-[var(--color-retro-muted)] hover:bg-[var(--color-retro-nav)]/80'
					}`}
					aria-current={activeSlug === game.slug ? 'page' : undefined}
				>
					{game.label}
				</a>
			{/each}
		</div>
		<div class="font-mono text-[10px] text-[var(--color-retro-muted)] uppercase">
			{activeGame.tagline}
		</div>
	</div>

	<div class="relative min-h-0 flex-1">
		<div class="flex h-full items-center justify-center px-2 pb-2">
			<div
				class="pixel-border w-full max-w-5xl bg-[var(--color-retro-card)]"
				style="max-height: calc(100vh - 200px);"
			>
				<div class="aspect-[4/3] h-full max-h-[calc(100vh-200px)] w-full">
					<svelte:component this={activeGame.component} />
				</div>
			</div>
		</div>
	</div>
</div>
