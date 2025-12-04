<script lang="ts">
	import { DitheredImage } from '$lib/components';
	import { onMount } from 'svelte';

	interface Photo {
		id: number;
		src: string;
		alt: string;
	}

	interface Props {
		photos: Photo[];
	}

	let { photos }: Props = $props();

	let currentIndex = $state(0);
	let thumbnailContainer: HTMLDivElement;
	let isTransitioning = $state(false);
	let loadedImages = $state(new Set<number>([])); // Start empty, will load all on mount

	// Load all images on mount
	onMount(() => {
		// Mark all images as loaded immediately
		const allIndices = new Set<number>();
		for (let i = 0; i < photos.length; i++) {
			allIndices.add(i);
		}
		loadedImages = allIndices;
	});

	// Lazy loading with Intersection Observer (kept for potential future use)
	let thumbnailObserver: IntersectionObserver;

	function observeThumbnail(node: HTMLElement, photoIndex: number) {
		if (!thumbnailObserver) {
			thumbnailObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const index = parseInt(entry.target.getAttribute('data-index') || '0');
							loadedImages.add(index);
							loadedImages = loadedImages; // Trigger reactivity
						}
					});
				},
				{
					root: null,
					rootMargin: '100px', // Start loading 100px before visible
					threshold: 0.01
				}
			);
		}

		thumbnailObserver.observe(node);

		return {
			destroy() {
				thumbnailObserver.unobserve(node);
			}
		};
	}

	function selectPhoto(index: number) {
		if (index === currentIndex || isTransitioning) return;
		isTransitioning = true;
		currentIndex = index;

		// Preload current and adjacent images
		loadedImages.add(index);
		loadedImages.add((index - 1 + photos.length) % photos.length); // Previous
		loadedImages.add((index + 1) % photos.length); // Next
		loadedImages = loadedImages;

		// Scroll thumbnail into view
		setTimeout(() => {
			const thumbnail = thumbnailContainer?.querySelector(`[data-index="${index}"]`);
			thumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
		}, 0);

		setTimeout(() => {
			isTransitioning = false;
		}, 300);
	}

	function nextPhoto() {
		selectPhoto((currentIndex + 1) % photos.length);
	}

	function prevPhoto() {
		selectPhoto((currentIndex - 1 + photos.length) % photos.length);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') {
			nextPhoto();
		} else if (e.key === 'ArrowLeft') {
			prevPhoto();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex h-screen flex-col overflow-hidden bg-[var(--color-bg-main)]">
	<!-- Header -->
	<div class="border-b border-[var(--color-border)] px-4 py-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/" class="font-mono text-sm text-[var(--color-accent)] hover:underline">
					← BACK
				</a>
				<h1 class="font-mono text-sm tracking-widest uppercase">MEMORIES // PHOTO_ALBUM</h1>
			</div>
			<div class="font-mono text-xs text-[var(--color-retro-muted)]">
				{currentIndex + 1} / {photos.length}
			</div>
		</div>
	</div>

	<!-- Main Image Display -->
	<div class="relative flex flex-1 items-center justify-center overflow-hidden p-8">
		<!-- Navigation Buttons -->
		<button
			onclick={prevPhoto}
			class="pixel-border absolute left-4 z-10 border border-[var(--color-border)] bg-[var(--color-retro-card)] p-3 transition-all hover:border-[var(--color-accent)]"
			aria-label="Previous photo"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m15 18-6-6 6-6" />
			</svg>
		</button>

		<!-- Center Image -->
		<div
			class="pixel-border flex items-center justify-center border-2 border-[var(--color-border)] bg-[var(--color-border)]/10 transition-opacity duration-300"
			class:opacity-50={isTransitioning}
			style="max-height: calc(100vh - 250px); max-width: 80%; height: fit-content; width: fit-content;"
		>
			{#key currentIndex}
				<DitheredImage
					src={photos[currentIndex].src}
					alt={photos[currentIndex].alt}
					pixelScale={2}
					className="h-[calc(100dvh_-_255px)] w-full"
					canvasClassName="h-full w-full"
					contrast={1.2}
					objectFit="cover"
				/>
			{/key}
		</div>

		<button
			onclick={nextPhoto}
			class="pixel-border absolute right-4 z-10 border border-[var(--color-border)] bg-[var(--color-retro-card)] p-3 transition-all hover:border-[var(--color-accent)]"
			aria-label="Next photo"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m9 18 6-6-6-6" />
			</svg>
		</button>
	</div>

	<!-- Thumbnail Strip -->
	<div class="border-t border-[var(--color-border)] bg-[var(--color-retro-card)] p-4">
		<div bind:this={thumbnailContainer} class="flex gap-3 overflow-x-auto pb-2">
			{#each photos as photo, i}
				<button
					data-index={i}
					use:observeThumbnail={i}
					onclick={() => selectPhoto(i)}
					class="pixel-border shrink-0 cursor-pointer border-2 transition-all"
					class:border-[var(--color-accent)]={i === currentIndex}
					class:border-[var(--color-border)]={i !== currentIndex}
					class:opacity-50={i !== currentIndex}
					aria-label="View photo {i + 1}"
				>
					<div class="aspect-square w-24 overflow-hidden">
						{#if loadedImages.has(i)}
							<DitheredImage
								src={photo.src}
								alt={photo.alt}
								pixelScale={3}
								className="h-full w-full"
								canvasClassName="h-full w-full"
								objectFit="cover"
								contrast={1.2}
							/>
						{:else}
							<div
								class="flex h-full w-full items-center justify-center bg-[var(--color-border)]/10"
							>
								<span class="font-mono text-[8px] text-[var(--color-retro-muted)]">...</span>
							</div>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.scrollbar-thin::-webkit-scrollbar {
		height: 6px;
	}

	.scrollbar-thin::-webkit-scrollbar-track {
		background: var(--color-border);
		opacity: 0.2;
	}

	.scrollbar-thin::-webkit-scrollbar-thumb {
		background: var(--color-accent);
		border-radius: 3px;
	}
</style>
