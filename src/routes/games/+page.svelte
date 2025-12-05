<script lang="ts">
	const cabinets = [
		{
			slug: 'asteroids',
			title: 'Asteroids Redux',
			description: 'Arrow keys to steer, Space to fire. Q / Esc exits.'
		},
		{
			slug: 'snake',
			title: 'Retro Snake',
			description: 'Arrows or WASD to slither. Walls are deadly.'
		}
	];
</script>

<div class="flex min-h-screen flex-col overflow-hidden px-2 py-4 md:px-4">
	<div class="mb-4 flex items-center justify-between border-b border-[var(--color-border)] pb-3">
		<div class="flex items-center gap-3">
			<div class="grid h-9 w-9 place-items-center border border-[var(--color-border)] bg-[var(--color-retro-card)]">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>
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
						<div class="grid h-10 w-10 place-items-center border border-[var(--color-border)] bg-[var(--color-bg-main)]">
							{#if cabinet.slug === 'asteroids'}
								<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
							{:else if cabinet.slug === 'snake'}
								<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 6v12"/><path d="M20 18V6"/><path d="M12 12h8"/></svg>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></svg>
							{/if}
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
