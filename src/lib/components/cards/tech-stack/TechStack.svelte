<script lang="ts">
	const stack = [
		{
			category: 'Frontend',
			items: [
				'Svelte & SvelteKit',
				'Tailwind CSS',
				'React',
				'Angular',
				'SwiftUI',
				'Next.js',
				'TypeScript',
				'JavaScript',
				'Redux',
				'HTML 5',
				'CSS',
				'SCSS'
			]
		},
		{
			category: 'Design / UI',
			items: [
				'Responsive design',
				'Custom icon systems',
				'Micro-animations',
				'UI libraries',
				'Interactive components',
				'Custom component libraries',
				'Adobe Suite',
				'Figma',
				'Affinity'
			]
		},
		{
			category: 'Backend & APIs',
			items: [
				'.Net',
				'C#',
				'Node.js',
				'Supabase',
				'Auth',
				'Postgres',
				'RLS & SQL policies',
				'Supabase Storage',
				'Edge functions',
				'Ruby on Rails',
				'Laravel',
				'REST & GraphQL',
				'Microsoft Graph API',
				'Contentful'
			]
		},
		{
			category: 'Infra / DevOps',
			items: [
				'Netlify',
				'Azure DevOps',
				'GitHub Actions',
				'Docker',
				'Ubuntu Server',
				'Heroku',
				'NGINX'
			]
		},
		{
			category: 'Cloud / Services',
			items: ['Azure', 'Supabase', 'Brave Search API']
		},
		{
			category: 'AI / LLM',
			items: [
				'OpenAI / ChatGPT',
				'OpenAI Codex',
				'Claude',
				'Gemini',
				'Auto-translation',
				'Content fallback'
			]
		},
		{
			category: 'Mobile / Native',
			items: ['Swift / SwiftUI', 'Apple Entitlements', 'Xcode pipelines', 'iOS/macOS dev']
		},
		{
			category: 'IoT & Hardware',
			items: ['Raspberry Pi', 'Zigbee', 'Home Assistant']
		},
		{
			category: 'Data & SEO',
			items: ['Google Analytics', 'Matomo', 'Structured SEO', 'i18n strategy']
		},
		{
			category: 'Testing & Arch',
			items: ['Component-driven', 'Monorepos', 'Unit testing', 'Manual QA', 'Code audits']
		},
		{
			category: 'Soft Skills',
			items: [
				'Client communication',
				'Proposal writing',
				'Project leadership',
				'Planning & scoping',
				'Documentation'
			]
		}
	];

	import { layoutState } from '$lib/stores/layoutStore.svelte';

	interface Props {
		mode?: 'preview' | 'full';
	}

	let { mode = 'full' }: Props = $props();

	const previewItems = [
		'Svelte & SvelteKit',
		'TypeScript',
		'Tailwind CSS',
		'Node.js',
		'Postgres',
		'Figma',
		'Docker',
		'OpenAI / AI'
	];
</script>

{#if mode === 'preview'}
	<div class="flex h-full flex-col justify-center">
		<div class="flex flex-wrap gap-2">
			{#each previewItems as tech}
				<span
					class="cursor-default border border-[var(--color-border)] px-2 py-1 font-mono text-[10px] transition-colors hover:bg-[var(--color-text-main)] hover:text-[var(--color-bg-main)]"
				>
					{tech}
				</span>
			{/each}
			<button
				onclick={() => layoutState.openModal('stack')}
				class="border border-dashed border-[var(--color-border)] px-2 py-1 font-mono text-[10px] text-[var(--color-retro-muted)] transition-colors hover:bg-[var(--color-border)] hover:text-[var(--color-bg-main)]"
			>
				VIEW_ALL_TECH ->
			</button>
		</div>
	</div>
{:else}
	<div class="h-full w-full overflow-y-auto pr-2">
		<div class="flex flex-col gap-4 pb-2">
			{#each stack as group}
				<div>
					<h4
						class="mb-2 font-mono text-[10px] font-bold text-[var(--color-retro-muted)] uppercase"
					>
						{group.category}
					</h4>
					<div class="flex flex-wrap gap-1.5">
						{#each group.items as tech}
							<span
								class="cursor-default border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[9px] transition-colors hover:bg-[var(--color-text-main)] hover:text-[var(--color-bg-main)]"
							>
								{tech}
							</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
