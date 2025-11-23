<script lang="ts">
	import BentoGrid from '$lib/components/bento/BentoGrid.svelte';
	import BentoCard from '$lib/components/bento/BentoCard.svelte';
	import BentoDrawing from '$lib/components/bento/BentoDrawing.svelte';

	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	});
</script>

<div class="flex h-screen flex-col overflow-hidden px-2 py-4 md:px-4">
	<!-- Top HUD Bar -->
	<div
		class="mb-4 flex items-center justify-between border-b border-[var(--color-border)] px-2 pb-2"
	>
		<div class="flex items-center gap-4">
			<div class="grid h-6 w-6 grid-cols-2 gap-0.5">
				<div class="bg-[var(--color-accent)]"></div>
				<div class="bg-[var(--color-border)]"></div>
				<div class="bg-[var(--color-border)]"></div>
				<div class="bg-[var(--color-accent)]"></div>
			</div>
			<h1 class="font-mono text-sm tracking-widest uppercase">
				Portfolio // <span class="text-[var(--color-accent)]">Elmen_Dev</span>
			</h1>
		</div>
		<div class="flex gap-8 font-mono text-xs text-[var(--color-retro-muted)]">
			<span>MODE: BUILDING</span>
			<span>LOC: SWEDEN</span>
			<span>{today}</span>
		</div>
	</div>

	<div class="flex-1 overflow-y-auto">
		<BentoGrid>
			<!-- 
                Developer Portfolio Layout (12 cols, auto-rows-160px)
            -->

			<!-- Bio / Intro (Large Top Left) -->
			<BentoCard colSpan={6} rowSpan={2} title="IDENTITY // BIO">
				<div class="flex h-full flex-col justify-between">
					<div>
						<pre
							class="mb-4 font-mono text-[8px] leading-[8px] tracking-tighter text-[var(--color-accent)] md:text-[10px] md:leading-[10px]">
 mmmmm    "                                       mmmmmm ""#              m"        
 #   "# mmm     mmm    m mm   m mm   mmm          #        #    mmmmm   mmm   m mm  
 #mmm#"   #    #"  #   #"  "  #"  " #"  #         #mmmmm   #    # # #  #"  #  #"  # 
 #        #    #""""   #      #     #""""         #        #    # # #  #""""  #   # 
 #      mm#mm  "#mm"   #      #     "#mm"         #mmmmm   "mm  # # #  "#mm"  #   # 
</pre>
						<p
							class="max-w-prose font-mono text-sm leading-relaxed text-[var(--color-retro-muted)] md:text-base"
						>
							> Full-stack engineer specializing in high-performance web applications.<br />
							> Obsessed with pixel-perfect UIs and developer experience.<br />
							> Currently exploring: Svelte, SvelteKit and AI Agents.
						</p>
					</div>
					<div class="mt-4 flex gap-4">
						<button
							class="bg-[var(--color-text-main)] px-4 py-2 font-mono text-xs text-[var(--color-bg-main)] transition-colors hover:bg-[var(--color-accent)]"
						>
							DOWNLOAD_CV
						</button>
						<button
							class="border border-[var(--color-border)] px-4 py-2 font-mono text-xs transition-colors hover:bg-[var(--color-border)] hover:text-[var(--color-bg-main)]"
						>
							CONTACT_ME
						</button>
					</div>
				</div>
			</BentoCard>

			<!-- Status / Availability (Small Top Right) -->
			<BentoCard colSpan={3} rowSpan={1} title="STATUS // CURRENT">
				<div class="flex h-full items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="relative">
							<div class="h-3 w-3 rounded-full bg-red-500"></div>
							<div
								class="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-red-500 opacity-75"
							></div>
						</div>
						<div>
							<div class="text-sm font-bold">NOT AVAILABLE</div>
							<div class="text-[10px] text-[var(--color-retro-muted)]">BUSY BUILDING</div>
						</div>
					</div>
				</div>
			</BentoCard>

			<!-- Socials (Small Top Right) -->
			<BentoCard colSpan={3} rowSpan={1} title="NETWORK // CONNECT">
				<div class="flex h-full items-center justify-around">
					<a
						href="https://github.com"
						class="flex flex-col items-center gap-1 transition-colors hover:text-[var(--color-accent)]"
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
							stroke-linejoin="round"
							><path
								d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
							/><path d="M9 18c-4.51 2-5-2-7-2" /></svg
						>
						<span class="font-mono text-[10px]">GH</span>
					</a>
					<a
						href="mailto:hello@example.com"
						class="flex flex-col items-center gap-1 transition-colors hover:text-[var(--color-accent)]"
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
							stroke-linejoin="round"
							><rect width="20" height="16" x="2" y="4" rx="2" /><path
								d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
							/></svg
						>
						<span class="font-mono text-[10px]">MAIL</span>
					</a>
					<a
						href="https://linkedin.com"
						class="flex flex-col items-center gap-1 transition-colors hover:text-[var(--color-accent)]"
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
							stroke-linejoin="round"
							><path
								d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
							/><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg
						>
						<span class="font-mono text-[10px]">IN</span>
					</a>
				</div>
			</BentoCard>

			<!-- Tech Stack (Wide Middle) -->
			<BentoCard colSpan={6} rowSpan={1} title="ARSENAL // TECH_STACK">
				<div class="flex h-full flex-col justify-center">
					<div class="flex flex-wrap gap-2">
						{#each ['SvelteKit', 'TypeScript', 'Tailwind', 'Rust', 'Node.js', 'Postgres', 'Docker', 'Figma'] as tech}
							<span
								class="cursor-default border border-[var(--color-border)] px-2 py-1 font-mono text-[10px] transition-colors hover:bg-[var(--color-text-main)] hover:text-[var(--color-bg-main)]"
							>
								{tech}
							</span>
						{/each}
					</div>
				</div>
			</BentoCard>

			<!-- Project 1 (Large) -->
			<BentoCard
				colSpan={4}
				rowSpan={2}
				href="/project/alpha"
				title="PROJECT // ALPHA"
				clickable={true}
			>
				<div class="flex h-full flex-col">
					<div
						class="mb-4 flex flex-1 items-center justify-center overflow-hidden border border-[var(--color-border)]/20 bg-[var(--color-border)]/10 transition-colors group-hover:border-[var(--color-accent)]"
					>
						<span class="font-mono text-xs text-[var(--color-retro-muted)]"
							>PREVIEW_IMAGE_placeholder</span
						>
					</div>
					<div>
						<h3 class="text-lg font-bold">Next-Gen Dashboard</h3>
						<p class="mt-1 text-xs text-[var(--color-retro-muted)]">
							Real-time analytics platform with WebSockets and D3.js.
						</p>
						<div class="mt-2 flex gap-2">
							<span class="border border-[var(--color-border)] px-1 font-mono text-[9px]"
								>SVELTE</span
							>
							<span class="border border-[var(--color-border)] px-1 font-mono text-[9px]">D3</span>
						</div>
					</div>
				</div>
			</BentoCard>

			<!-- Drawing / Request (Square-ish) -->
			<BentoDrawing colSpan={4} rowSpan={2} />

			<!-- Blog / Writing (Vertical) -->
			<BentoCard colSpan={4} rowSpan={2} title="LOGS // WRITING">
				<div class="flex h-full flex-col gap-4 overflow-y-auto pr-2">
					{#each [{ title: 'The Future of Svelte Runes', date: '2024-10-24' }, { title: 'Building Resilient APIs', date: '2024-09-15' }, { title: 'Why I switched to Rust', date: '2024-08-02' }] as post}
						<a
							href="/blog/post"
							class="group/link border-l-2 border-[var(--color-border)] py-1 pl-3 transition-colors hover:border-[var(--color-accent)]"
						>
							<p
								class="text-xs font-bold transition-colors group-hover/link:text-[var(--color-accent)]"
							>
								{post.title}
							</p>
							<p class="text-[9px] text-[var(--color-retro-muted)]">{post.date}</p>
						</a>
					{/each}
					<div class="mt-auto pt-2">
						<a href="/blog" class="font-mono text-[10px] hover:underline">VIEW_ALL_LOGS -></a>
					</div>
				</div>
			</BentoCard>

			<!-- Footer / Copyright -->
			<BentoCard
				colSpan={12}
				rowSpan={1}
				class="bg-[var(--color-text-main)] text-[var(--color-bg-main)]"
			>
				<div class="flex h-full items-center justify-between">
					<div class="flex gap-4 font-mono text-[10px]">
						<span>© 2025 PIERRE ELMEN</span>
						<span>ALL RIGHTS RESERVED</span>
					</div>
					<div class="flex gap-2">
						<div class="h-2 w-2 animate-pulse bg-[var(--color-bg-main)]"></div>
						<div class="h-2 w-2 bg-[var(--color-bg-main)] opacity-50"></div>
						<div class="h-2 w-2 bg-[var(--color-bg-main)] opacity-25"></div>
					</div>
				</div>
			</BentoCard>
		</BentoGrid>
	</div>
</div>
