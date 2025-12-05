<script lang="ts">
	import { layoutState } from '$lib/stores/layoutStore.svelte';

	const gameLineup = [
		{
			title: 'Asteroids Redux',
			description: 'Arrow keys to steer, Space to fire. Q / Esc to exit.',
			ready: true,
			href: '/games/asteroids'
		},
		{
			title: 'Retro Snake',
			description: 'Arrows or WASD to slither. Walls are deadly.',
			ready: true,
			href: '/games/snake'
		},
		{
			title: 'Pong Duel',
			description: 'Head-to-head with keyboard support.',
			ready: true,
			href: '/games/pong'
		}
	];
</script>

<div class="mt-6 space-y-3">
	{#each gameLineup as game}
		<div class="border border-[var(--color-border)] bg-[var(--color-bg-main)] p-3">
			<div class="flex items-center justify-between">
				<div class="font-mono text-sm uppercase tracking-widest">{game.title}</div>
			</div>
			<p class="mt-1 text-xs text-[var(--color-retro-muted)]">{game.description}</p>

			{#if game.ready && game.href}
				<a
					href={game.href}
					class="mt-3 inline-flex items-center gap-2 border border-[var(--color-border)] bg-[var(--color-bg-main)] px-3 py-2 text-[11px] uppercase tracking-widest transition-colors hover:bg-[var(--color-retro-nav)]"
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
						stroke-linejoin="round"
					>
						<path d="m7 7 10 10" />
						<path d="M17 7v10H7" />
					</svg>
				</a>
			{:else}
				<div
					class="mt-3 inline-flex items-center gap-2 border border-dashed border-[var(--color-border)] px-3 py-2 text-[11px] uppercase tracking-widest text-[var(--color-retro-muted)]"
				>
					Coming soon
				</div>
			{/if}
		</div>
	{/each}
</div>
