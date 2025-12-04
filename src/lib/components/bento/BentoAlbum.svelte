<script lang="ts">
	import { DitheredImage } from '$lib/components';
	import { onMount } from 'svelte';

	interface Props {
		colSpan?: number;
		rowSpan?: number;
	}

	let { colSpan = 3, rowSpan = 1 }: Props = $props();

	// Import first 6 photos for preview rotation
	import photo1 from '$lib/assets/images/photos/0540B02A-2538-434E-831A-C3C954602FA2.jpeg';
	import photo2 from '$lib/assets/images/photos/095A13A5-F693-482C-8DB2-34E310DD74CD.jpeg';
	import photo3 from '$lib/assets/images/photos/24A9DCC5-D8FD-462C-BB73-1CAF6B71B749.jpeg';
	import photo4 from '$lib/assets/images/photos/2C9CC845-6428-4F5A-A91D-E5E846DF177D.jpeg';
	import photo5 from '$lib/assets/images/photos/3A5C7BCB-878A-4853-B2CD-36DD41310437.jpeg';
	import photo6 from '$lib/assets/images/photos/3A7D4371-C76F-4A66-9076-DC22DC04E33A.jpeg';

	const allPhotos = [
		{ id: 1, src: photo1, alt: 'Photo 1' },
		{ id: 2, src: photo2, alt: 'Photo 2' },
		{ id: 3, src: photo3, alt: 'Photo 3' },
		{ id: 4, src: photo4, alt: 'Photo 4' },
		{ id: 5, src: photo5, alt: 'Photo 5' },
		{ id: 6, src: photo6, alt: 'Photo 6' }
	];

	let startIndex = $state(0);

	// Get 3 photos starting from startIndex
	const previewPhotos = $derived([
		allPhotos[startIndex % allPhotos.length],
		allPhotos[(startIndex + 1) % allPhotos.length],
		allPhotos[(startIndex + 2) % allPhotos.length]
	]);

	/* Future Supabase structure:
	interface Photo {
		id: number;
		src: string;
		alt: string;
		caption?: string;
		date_taken?: string;
		location?: string;
	}
	*/

	// Auto-rotate images every 5 seconds
	onMount(() => {
		const interval = setInterval(() => {
			startIndex = (startIndex + 3) % allPhotos.length;
		}, 10000);

		return () => clearInterval(interval);
	});

	// Tailwind class maps
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

	const colClass = colSpanMap[colSpan] || 'md:col-span-3';
	const rowClass = rowSpanMap[rowSpan] || 'row-span-1';
</script>

<a
	href="/photos"
	class="group pixel-border relative col-span-1 block overflow-hidden bg-[var(--color-retro-card)] transition-all {colClass} {rowClass} hover:-translate-y-1 hover:shadow-lg"
>
	<!-- HUD Corner Brackets -->
	<div
		class="absolute top-0 left-0 z-20 h-2 w-2 border-t-2 border-l-2 border-[var(--color-border)]"
	></div>
	<div
		class="absolute top-0 right-0 z-20 h-2 w-2 border-t-2 border-r-2 border-[var(--color-border)]"
	></div>
	<div
		class="absolute bottom-0 left-0 z-20 h-2 w-2 border-b-2 border-l-2 border-[var(--color-border)]"
	></div>
	<div
		class="absolute right-0 bottom-0 z-20 h-2 w-2 border-r-2 border-b-2 border-[var(--color-border)]"
	></div>

	<div class="relative z-10 flex h-full flex-col p-4">
		<!-- Header -->
		<div
			class="mb-3 flex items-center justify-between border-b border-[var(--color-border)]/20 pb-2"
		>
			<h3 class="font-mono text-xs tracking-widest text-[var(--color-retro-muted)] uppercase">
				MEMORIES // ALBUM
			</h3>
			<div class="flex gap-1">
				<div class="h-1 w-1 bg-[var(--color-accent)]"></div>
				<div class="h-1 w-1 bg-[var(--color-border)] opacity-20"></div>
			</div>
		</div>

		<!-- Images in a Row - Square aspect ratio -->
		<div class="flex flex-1 items-center gap-2">
			{#each previewPhotos as photo (photo.id)}
				<div
					class="aspect-square overflow-hidden border border-[var(--color-border)] bg-[var(--color-border)]/10 transition-all group-hover:border-[var(--color-accent)]"
					style="width: calc((100% - 1rem) / 3);"
				>
					<DitheredImage
						src={photo.src}
						alt={photo.alt}
						pixelScale={3}
						className="max-h-full max-w-full"
						objectFit="cover"
						contrast={1.2}
					/>
				</div>
			{/each}
		</div>
	</div>
</a>
