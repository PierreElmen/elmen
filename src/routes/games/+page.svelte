<script lang="ts">
	const cabinets = [
		{
			slug: 'asteroids',
			title: 'Asteroids Redux',
			icon: '🪐',
			description: 'Arrow keys to steer, Space to fire. Q / Esc exits.'
		},
		{
			slug: 'snake',
			title: 'Retro Snake',
			icon: '🐍',
			description: 'Arrows or WASD to slither. Walls are deadly.'
		}
	];
</script>

<div class="flex min-h-screen flex-col overflow-hidden px-2 py-4 md:px-4">
	<div class="mb-4 flex items-center justify-between border-b border-[var(--color-border)] pb-3">
		<div class="flex items-center gap-3">
			<div class="grid h-9 w-9 place-items-center border border-[var(--color-border)] bg-[var(--color-retro-card)] text-xl">
				🎮
			</div>
			<div>
				<h1 class="font-mono text-lg uppercase tracking-widest">Arcade / Games</h1>
				<p class="text-xs text-[var(--color-retro-muted)]">
					Pick a cabinet to launch. Each opens in its own page.
				</p>
			</div>
		</div>
		<div class="font-mono text-xs text-[var(--color-retro-muted)]">
			Cursor control will be captured while a game is running.
		</div>
	</div>

	<div class="flex-1">
		<div class="grid gap-4 md:grid-cols-2">
			{#each cabinets as cabinet}
				<a
					href={`/games/${cabinet.slug}`}
					class="pixel-border group flex h-full flex-col justify-between border border-[var(--color-border)] bg-[var(--color-retro-card)] p-4 transition-colors hover:bg-[var(--color-bg-main)]"
				>
					<div class="flex items-start gap-3">
						<div class="grid h-10 w-10 place-items-center border border-[var(--color-border)] bg-[var(--color-bg-main)] text-2xl">
							{cabinet.icon}
						</div>
						<div class="flex-1">
							<div class="font-mono text-sm uppercase tracking-widest">{cabinet.title}</div>
							<p class="text-xs text-[var(--color-retro-muted)]">{cabinet.description}</p>
						</div>
					</div>
					<div class="mt-4 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[var(--color-retro-muted)]">
						<span>Enter cabinet</span>
						<span class="transition-transform group-hover:translate-x-1">→</span>
					</div>
				</a>
			{/each}
		</div>

		<div class="mt-6 text-[11px] text-[var(--color-retro-muted)]">
			Tip: Use the left nav "Games" button to pop this list open anytime.
		</div>
	</div>
</div>
