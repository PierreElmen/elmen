<script lang="ts">
	import type { PageData } from './$types';
	import AsteroidsGame from '$lib/games/AsteroidsGame.svelte';
	import SnakeGame from '$lib/games/SnakeGame.svelte';

	type GameOption = {
		slug: string;
		label: string;
		tagline: string;
		component: typeof AsteroidsGame | typeof SnakeGame;
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

<div class="flex min-h-screen flex-col overflow-hidden px-2 py-4 md:px-4">
	<div class="mb-4 flex items-center justify-between border-b border-[var(--color-border)] pb-3">
		<div class="flex items-center gap-3">
			<div class="grid h-9 w-9 place-items-center border border-[var(--color-border)] bg-[var(--color-retro-card)] text-xl">
				🎮
			</div>
			<div>
				<h1 class="font-mono text-lg uppercase tracking-widest">Arcade / {activeGame.label}</h1>
				<p class="text-xs text-[var(--color-retro-muted)]">
					{activeGame.tagline}
				</p>
			</div>
		</div>
		<div class="font-mono text-xs text-[var(--color-retro-muted)]">
			Cursor control will be captured while a game is running.
		</div>
	</div>

	<div class="mb-3 flex flex-wrap items-center justify-between gap-2 rounded border border-[var(--color-border)] bg-[var(--color-bg-main)] px-3 py-2">
		<div class="flex flex-wrap gap-2">
			{#each gameList as game}
				<a
					href={`/games/${game.slug}`}
					class={`border border-[var(--color-border)] px-3 py-1 font-mono text-[11px] uppercase tracking-widest transition-colors ${
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
		<div class="text-[10px] font-mono uppercase text-[var(--color-retro-muted)]">
			{activeGame.tagline}
		</div>
	</div>

	<div class="relative flex-1">
		<div class="flex h-full items-center justify-center px-2 pb-2">
			<div
				class="pixel-border bg-[var(--color-retro-card)] w-full max-w-5xl"
				style="max-height: calc(100vh - 200px);"
			>
				<div class="aspect-[4/3] h-full w-full max-h-[calc(100vh-200px)]">
					<svelte:component this={activeGame.component} />
				</div>
			</div>
		</div>
	</div>
</div>
