<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		src: string;
		alt?: string;
		pixelScale?: number; // Size of "pixels" (e.g., 4 means 1 image pixel = 4 screen pixels)
		className?: string;
		canvasClassName?: string;
		contrast?: number;
		objectFit?: 'cover' | 'contain'; // Control how image fits in container
	}

	let {
		src,
		alt = '',
		pixelScale = 4,
		className = '',
		canvasClassName = '',
		contrast = 1.0,
		objectFit = 'cover'
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let width = $state(0);
	let height = $state(0);
	let isLoaded = $state(false);

	// Helper to parse CSS colors
	function parseColor(color: string): [number, number, number] {
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return [0, 0, 0];
		ctx.fillStyle = color;
		const hex = ctx.fillStyle; // Returns #RRGGBB
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return [r, g, b];
	}

	function getLuminance(r: number, g: number, b: number) {
		return 0.299 * r + 0.587 * g + 0.114 * b;
	}

	function processImage() {
		if (!canvas || !src) return;

		const img = new Image();
		img.crossOrigin = 'Anonymous';
		img.src = src;

		img.onload = () => {
			const ctx = canvas.getContext('2d', { willReadFrequently: true });
			if (!ctx) return;

			// Get theme colors
			const style = getComputedStyle(document.body);
			const bgMain = style.getPropertyValue('--color-bg-main').trim();
			const textMain = style.getPropertyValue('--color-text-main').trim();
			// We can also use accent for a bit more pop if desired, but user said "monochrome palette"
			// Let's stick to bg and text for high contrast.

			const color1 = parseColor(bgMain);
			const color2 = parseColor(textMain);

			// Determine which is dark and which is light
			const lum1 = getLuminance(...color1);
			const lum2 = getLuminance(...color2);

			const darkColor = lum1 < lum2 ? color1 : color2;
			const lightColor = lum1 < lum2 ? color2 : color1;

			// Calculate dimensions
			// We want the final canvas to fill the container, but the internal resolution to be lower.
			// Actually, we should probably just set the canvas size to the small resolution and let CSS scale it up with image-rendering: pixelated.

			// However, to ensure it matches the container size exactly, let's see.
			// If we use CSS scaling, we need to know the aspect ratio.

			// Let's try to fit the image into the container or just use the image's aspect ratio.
			// For now, let's assume we want to maintain aspect ratio.

			const targetWidth = Math.ceil(img.width / pixelScale);
			const targetHeight = Math.ceil(img.height / pixelScale);

			canvas.width = targetWidth;
			canvas.height = targetHeight;

			// Draw original image downscaled
			ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

			const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
			const data = imageData.data;

			// Pre-calculate contrast factor
			// Formula: factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
			// contrast value range: -255 to 255.
			// But our prop is likely 1.0 (normal) to say 2.0 (high).
			// Let's map 1.0 -> 0, 2.0 -> 128?
			// Standard contrast formula usually takes a value C where 0 is no change.
			// Let's use a simpler multiplier approach for "contrast" as a multiplier around 128.
			// newColor = (oldColor - 128) * contrast + 128

			// Let's rewrite the loop to be 2 passes for correctness.

			// Pass 1: Grayscale + Contrast
			for (let j = 0; j < data.length; j += 4) {
				let gray = getLuminance(data[j], data[j + 1], data[j + 2]);
				gray = (gray - 128) * contrast + 128;
				gray = Math.max(0, Math.min(255, gray));
				data[j] = gray;
				data[j + 1] = gray;
				data[j + 2] = gray;
			}

			// Pass 2: Dithering
			for (let y = 0; y < targetHeight; y++) {
				for (let x = 0; x < targetWidth; x++) {
					const i = (y * targetWidth + x) * 4;

					const currentGray = data[i]; // It's already gray

					const useLight = currentGray > 128;
					const targetColor = useLight ? lightColor : darkColor;

					// We want to write the target COLOR to the pixel
					data[i] = targetColor[0];
					data[i + 1] = targetColor[1];
					data[i + 2] = targetColor[2];

					// Error is difference between what we wanted (currentGray) and what we got (luminance of targetColor)
					// This ensures we maintain the luminance density.
					const targetLum = getLuminance(targetColor[0], targetColor[1], targetColor[2]);
					const error = currentGray - targetLum;

					const distribute = (dx: number, dy: number, factor: number) => {
						const nx = x + dx;
						const ny = y + dy;
						if (nx >= 0 && nx < targetWidth && ny >= 0 && ny < targetHeight) {
							const ni = (ny * targetWidth + nx) * 4;
							// Add error to the neighbor's gray value
							const newVal = data[ni] + error * factor;
							data[ni] = newVal;
							data[ni + 1] = newVal;
							data[ni + 2] = newVal;
						}
					};

					distribute(1, 0, 7 / 16);
					distribute(-1, 1, 3 / 16);
					distribute(0, 1, 5 / 16);
					distribute(1, 1, 1 / 16);
				}
			}

			ctx.putImageData(imageData, 0, 0);
			isLoaded = true;
		};
	}

	onMount(() => {
		processImage();

		// Re-process on theme change (observer)
		const observer = new MutationObserver(() => {
			processImage();
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme', 'style', 'class']
		});

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={container}
	class="relative flex items-center justify-center overflow-hidden {className}"
	style="max-width: 100%; max-height: 100%;"
>
	<canvas
		bind:this={canvas}
		class="h-auto max-h-full w-auto max-w-full object-{objectFit} {canvasClassName}"
		style="image-rendering: pixelated;"
	></canvas>
</div>
