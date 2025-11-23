<script lang="ts">
	import { onMount } from 'svelte';
	import BentoCard from './BentoCard.svelte';

	interface Props {
		colSpan?: number;
		rowSpan?: number;
	}

	let { colSpan = 4, rowSpan = 2 }: Props = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let isDrawing = false;
	let color = '#2a2a2a'; // Default text color, will update from CSS var

	// Store strokes as array of points
	type Point = { x: number; y: number };
	let strokes: Point[][] = [];
	let currentStroke: Point[] = [];

	function getThemeColor() {
		if (typeof window === 'undefined') return '#2a2a2a';
		const computedStyle = getComputedStyle(document.documentElement);
		// Try to get the text color, fallback to a default
		return computedStyle.getPropertyValue('--color-text-main').trim() || '#2a2a2a';
	}

	function resizeCanvas() {
		if (!canvas) return;
		const parent = canvas.parentElement;
		if (parent) {
			canvas.width = parent.clientWidth;
			canvas.height = parent.clientHeight;
			redraw(); // Redraw after resize to keep content
		}
	}

	function redraw() {
		if (!ctx || !canvas) return;

		// Clear and reset context
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Update color
		color = getThemeColor();
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = 2;
		ctx.strokeStyle = color;

		// Redraw all strokes
		strokes.forEach((stroke) => {
			if (stroke.length < 2) return;
			ctx!.beginPath();
			ctx!.moveTo(stroke[0].x, stroke[0].y);
			for (let i = 1; i < stroke.length; i++) {
				ctx!.lineTo(stroke[i].x, stroke[i].y);
			}
			ctx!.stroke();
		});
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		if (ctx) {
			color = getThemeColor();
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.lineWidth = 2;
			ctx.strokeStyle = color;
		}

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		// Watch for theme changes
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
					redraw();
				}
			});
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			observer.disconnect();
		};
	});

	function startDrawing(e: MouseEvent | TouchEvent) {
		isDrawing = true;
		color = getThemeColor();
		if (ctx) {
			ctx.strokeStyle = color;
			ctx.beginPath();
		}
		currentStroke = [];
		draw(e);
	}

	function stopDrawing() {
		isDrawing = false;
		if (ctx) ctx.beginPath();
		if (currentStroke.length > 0) {
			strokes.push([...currentStroke]);
			currentStroke = [];
		}
	}

	function draw(e: MouseEvent | TouchEvent) {
		if (!isDrawing || !ctx) return;

		const rect = canvas.getBoundingClientRect();
		let x, y;

		if (window.TouchEvent && e instanceof TouchEvent) {
			e.preventDefault(); // Prevent scrolling while drawing
			x = e.touches[0].clientX - rect.left;
			y = e.touches[0].clientY - rect.top;
		} else if (e instanceof MouseEvent) {
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
		} else {
			return;
		}

		// Add point to current stroke
		currentStroke.push({ x, y });

		ctx.lineTo(x, y);
		ctx.stroke();

		// We need to beginPath/moveTo for smoother lines if we were doing segments,
		// but for continuous drawing lineTo is fine if we started with beginPath in startDrawing.
		// However, the original code did beginPath/moveTo in draw loop which creates dots/segments.
		// Let's stick to a continuous line approach for better performance and storage.
		// Actually, to match the visual of "lineTo -> stroke -> beginPath -> moveTo" (which is what I had before),
		// let's adjust. The previous code was:
		// ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
		// This creates many small sub-paths.

		// Let's switch to standard:
		// startDrawing: calculate x,y. ctx.beginPath(); ctx.moveTo(x,y); currentStroke.push({x,y});
		// draw: calculate x,y. ctx.lineTo(x,y); ctx.stroke(); currentStroke.push({x,y});

		// I need to handle the "start" correctly.
		// Let's fix startDrawing to get coordinates too.
	}

	// Refined startDrawing to capture initial point
	function startDrawingRefined(e: MouseEvent | TouchEvent) {
		isDrawing = true;
		color = getThemeColor();

		const rect = canvas.getBoundingClientRect();
		let x, y;
		if (window.TouchEvent && e instanceof TouchEvent) {
			x = e.touches[0].clientX - rect.left;
			y = e.touches[0].clientY - rect.top;
		} else if (e instanceof MouseEvent) {
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
		} else {
			return;
		}

		currentStroke = [{ x, y }];

		if (ctx) {
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(x, y);
		}
	}

	function drawRefined(e: MouseEvent | TouchEvent) {
		if (!isDrawing || !ctx) return;

		const rect = canvas.getBoundingClientRect();
		let x, y;
		if (window.TouchEvent && e instanceof TouchEvent) {
			e.preventDefault();
			x = e.touches[0].clientX - rect.left;
			y = e.touches[0].clientY - rect.top;
		} else if (e instanceof MouseEvent) {
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
		} else {
			return;
		}

		currentStroke.push({ x, y });
		ctx.lineTo(x, y);
		ctx.stroke();
	}

	function clearCanvas() {
		if (!ctx || !canvas) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		strokes = [];
		currentStroke = [];
	}
</script>

<BentoCard {colSpan} {rowSpan} title="FUTURE // REQUEST">
	<div class="relative flex h-full flex-col">
		<div class="absolute top-0 right-0 z-30">
			<button
				onclick={clearCanvas}
				class="cursor-pointer border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1 font-mono text-[9px] hover:bg-[var(--color-border)] hover:text-[var(--color-bg-main)]"
				>CLEAR</button
			>
		</div>
		<div class="mb-2">
			<h3 class="text-sm font-bold md:text-base">What do you want me to do next?</h3>
			<p class="text-[10px] text-[var(--color-retro-muted)]">Draw or write your request below.</p>
		</div>
		<div
			class="h-full w-full flex-1 cursor-crosshair overflow-hidden border border-[var(--color-border)]/20 bg-[var(--color-bg-main)]"
		>
			<canvas
				bind:this={canvas}
				onmousedown={startDrawingRefined}
				onmouseup={stopDrawing}
				onmousemove={drawRefined}
				onmouseleave={stopDrawing}
				ontouchstart={startDrawingRefined}
				ontouchend={stopDrawing}
				ontouchmove={drawRefined}
				class="block touch-none"
			></canvas>
		</div>
	</div>
</BentoCard>
