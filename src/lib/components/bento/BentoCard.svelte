<script lang="ts">
	import { clickable as clickableAction } from '$lib/actions/clickable';

	interface Props {
		title?: string;
		class?: string;
		colSpan?: number;
		rowSpan?: number;
		href?: string;
		newTab?: boolean;
		noBorder?: boolean;
		clickable?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		title = '',
		class: className = '',
		colSpan = 1,
		rowSpan = 1,
		href = undefined,
		newTab = false,
		noBorder = false,
		clickable = false,
		children
	}: Props = $props();

	// Tailwind requires full class names to be present in the source to detect them.
	// We cannot use string interpolation like `md:col-span-${colSpan}`.

	const colSpanMap: Record<number, string> = {
		1: 'md:col-span-1',
		2: 'md:col-span-2',
		3: 'md:col-span-3',
		4: 'md:col-span-4',
		5: 'md:col-span-5',
		6: 'md:col-span-6',
		7: 'md:col-span-7',
		8: 'md:col-span-8',
		9: 'md:col-span-9',
		10: 'md:col-span-10',
		11: 'md:col-span-11',
		12: 'md:col-span-12'
	};

	const rowSpanMap: Record<number, string> = {
		1: 'row-span-1',
		2: 'row-span-2',
		3: 'row-span-3',
		4: 'row-span-4',
		5: 'row-span-5',
		6: 'row-span-6'
	};

	const colClass = colSpanMap[colSpan] || 'md:col-span-1';
	const rowClass = rowSpanMap[rowSpan] || 'row-span-1';

	// Base classes
	const baseClasses =
		'group relative block bg-[var(--color-retro-card)] overflow-hidden transition-all';
	const hoverClasses = href ? 'hover:-translate-y-1 hover:shadow-lg cursor-pointer' : '';
	const borderClasses = noBorder ? '' : 'pixel-border';

	// Action to use (conditionally applied via a wrapper action or just always apply if clickable is true)
	// Since we can't conditionally apply actions easily in svelte:element without a wrapper,
	// we'll use a simple action that does nothing if not enabled.
	function conditionalClickable(node: HTMLElement, enabled: boolean) {
		if (enabled) {
			return clickableAction(node);
		}
	}
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	{href}
	target={href && newTab ? '_blank' : undefined}
	rel={href && newTab ? 'noopener noreferrer' : undefined}
	class="{baseClasses} {hoverClasses} {borderClasses} col-span-1 {colClass} {rowClass} {className}"
	use:conditionalClickable={clickable}
>
	<!-- HUD Corner Brackets (Top Left) -->
	<div
		class="absolute top-0 left-0 z-20 h-2 w-2 border-t-2 border-l-2 border-[var(--color-border)]"
	></div>

	<!-- HUD Corner Brackets (Top Right) -->
	<div
		class="absolute top-0 right-0 z-20 h-2 w-2 border-t-2 border-r-2 border-[var(--color-border)]"
	></div>

	<!-- HUD Corner Brackets (Bottom Left) -->
	<div
		class="absolute bottom-0 left-0 z-20 h-2 w-2 border-b-2 border-l-2 border-[var(--color-border)]"
	></div>

	<!-- HUD Corner Brackets (Bottom Right) -->
	<div
		class="absolute right-0 bottom-0 z-20 h-2 w-2 border-r-2 border-b-2 border-[var(--color-border)]"
	></div>

	<div class="relative z-10 flex h-full flex-col p-4">
		{#if title}
			<div
				class="mb-4 flex items-center justify-between border-b border-[var(--color-border)]/20 pb-2"
			>
				<h3 class="font-mono text-xs tracking-widest text-[var(--color-retro-muted)] uppercase">
					{title}
				</h3>
				<!-- Decorative HUD element -->
				<div class="flex gap-1">
					<div class="h-1 w-1 bg-[var(--color-accent)]"></div>
					<div class="h-1 w-1 bg-[var(--color-border)] opacity-20"></div>
				</div>
			</div>
		{/if}

		<div class="min-h-0 flex-1">
			{@render children?.()}
		</div>
	</div>
</svelte:element>
