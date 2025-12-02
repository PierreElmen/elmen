<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { inputState } from '$lib/stores/inputState.svelte';

	type Point = { x: number; y: number };

	const lockId = 'snake';

	let canvasEl: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let viewportWidth = 0;
	let viewportHeight = 0;
	let gridCols = 0;
	let gridRows = 0;
	let offsetX = 0;
	let offsetY = 0;
	let animationHandle: number | null = null;
	let resizeObserver: ResizeObserver | null = null;

	const settings = {
		cellSize: 18,
		speedStart: 6.5, // moves per second
		speedIncrement: 0.25,
		maxSpeed: 15
	};

	let running = $state(false);
	let statusMessage = $state('Press START to slither.');
	let score = $state(0);
	let best = $state(0);
	let snake: Point[] = $state([]);
	let direction: Point = $state({ x: 1, y: 0 });
	let nextDirection: Point = $state({ x: 1, y: 0 });
	let food: Point | null = $state(null);
	let lastFrame = 0;
	let lastMove = 0;
	let moveInterval = $state(0);
	let themeColors = $state(readTheme());

	function readTheme() {
		if (typeof window === 'undefined') {
			return {
				bg: '#fdfbf7',
				line: '#2a2a2a',
				accent: '#ff6b6b'
			};
		}

		const root = getComputedStyle(document.documentElement);
		const read = (varName: string, fallback: string) =>
			root.getPropertyValue(varName)?.trim() || fallback;

		return {
			bg: read('--color-bg-card', '#fdfbf7'),
			line: read('--color-text-main', '#2a2a2a'),
			accent: read('--color-accent', '#ff6b6b')
		};
	}

	function resizeCanvas() {
		if (!canvasEl) return;

		const rect = canvasEl.getBoundingClientRect();
		viewportWidth = rect.width;
		viewportHeight = rect.height;

		const dpr = window.devicePixelRatio || 1;
		canvasEl.width = rect.width * dpr;
		canvasEl.height = rect.height * dpr;
		ctx = canvasEl.getContext('2d');

		if (ctx) {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		gridCols = Math.max(10, Math.floor(viewportWidth / settings.cellSize));
		gridRows = Math.max(10, Math.floor(viewportHeight / settings.cellSize));

		const gridWidth = gridCols * settings.cellSize;
		const gridHeight = gridRows * settings.cellSize;
		offsetX = Math.max(0, Math.floor((viewportWidth - gridWidth) / 2));
		offsetY = Math.max(0, Math.floor((viewportHeight - gridHeight) / 2));

		if (snake.length) {
			snake = snake.map((segment) => ({
				x: Math.min(Math.max(segment.x, 0), gridCols - 1),
				y: Math.min(Math.max(segment.y, 0), gridRows - 1)
			}));
		}

		if (food) {
			food = {
				x: Math.min(Math.max(food.x, 0), gridCols - 1),
				y: Math.min(Math.max(food.y, 0), gridRows - 1)
			};
		}
	}

	function startGame() {
		if (running) return;
		resizeCanvas();
		resetArena();
		attachListeners();
		inputState.lockControls(lockId);
		running = true;
		statusMessage = '';
		lastFrame = performance.now();
		lastMove = lastFrame;
		animationHandle = requestAnimationFrame(loop);
	}

	function exitGame(reason = 'Exited the cabinet.') {
		if (animationHandle) {
			cancelAnimationFrame(animationHandle);
			animationHandle = null;
		}

		best = Math.max(best, score);
		detachListeners();
		inputState.releaseControls(lockId);
		running = false;
		statusMessage = reason;
	}

	function resetArena() {
		score = 0;
		direction = { x: 1, y: 0 };
		nextDirection = { x: 1, y: 0 };
		moveInterval = 1000 / settings.speedStart;

		const startX = Math.floor(gridCols / 3);
		const startY = Math.floor(gridRows / 2);
		snake = [];
		for (let i = 0; i < 5; i++) {
			snake.push({ x: (startX - i + gridCols) % gridCols, y: startY });
		}

		spawnFood();
		statusMessage = 'Arrows / WASD steer. Walls are lethal. Q or Esc exits.';
	}

	function attachListeners() {
		window.addEventListener('keydown', handleKeyDown);
	}

	function detachListeners() {
		window.removeEventListener('keydown', handleKeyDown);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (!running) return;

		const key = event.key;
		if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(key)) {
			event.preventDefault();
		}

		if (key === 'ArrowUp' || key === 'w' || key === 'W') queueDirection(0, -1);
		if (key === 'ArrowDown' || key === 's' || key === 'S') queueDirection(0, 1);
		if (key === 'ArrowLeft' || key === 'a' || key === 'A') queueDirection(-1, 0);
		if (key === 'ArrowRight' || key === 'd' || key === 'D') queueDirection(1, 0);

		if (key === 'q' || key === 'Q' || key === 'Escape') {
			event.preventDefault();
			exitGame('Exited the cabinet.');
		}
	}

	function queueDirection(x: number, y: number) {
		// Block 180° turns relative to current movement to prevent instant self-collisions
		if (snake.length > 1 && direction.x === -x && direction.y === -y) return;

		// Ignore duplicate inputs within the same tick
		if (nextDirection.x === x && nextDirection.y === y) return;

		nextDirection = { x, y };
	}

	function loop(timestamp: number) {
		if (!running) return;
		const delta = Math.min(timestamp - lastFrame, 80);
		lastFrame = timestamp;

		if (timestamp - lastMove >= moveInterval) {
			stepSnake();
			lastMove = timestamp;
		}

		draw(delta);
		animationHandle = requestAnimationFrame(loop);
	}

	function stepSnake() {
		direction = { ...nextDirection };
		const head = snake[0];
		const newHead = {
			x: head.x + direction.x,
			y: head.y + direction.y
		};

		// Wall collision ends the run
		if (
			newHead.x < 0 ||
			newHead.y < 0 ||
			newHead.x >= gridCols ||
			newHead.y >= gridRows
		) {
			exitGame('You hit the wall. Press START to retry.');
			return;
		}

		if (snake.some((segment, idx) => idx > 0 && segment.x === newHead.x && segment.y === newHead.y)) {
			exitGame('You bit your tail. Press START to retry.');
			return;
		}

		snake.unshift(newHead);

		if (food && newHead.x === food.x && newHead.y === food.y) {
			score += 10;
			best = Math.max(best, score);
			tuneSpeed();
			spawnFood();
		} else {
			snake.pop();
		}
	}

	function tuneSpeed() {
		const eaten = score / 10;
		const speed = Math.min(settings.maxSpeed, settings.speedStart + eaten * settings.speedIncrement);
		moveInterval = 1000 / speed;
	}

	function spawnFood() {
		if (!gridCols || !gridRows) return;
		let attempts = 0;

		while (attempts < 200) {
			const x = Math.floor(Math.random() * gridCols);
			const y = Math.floor(Math.random() * gridRows);
			if (!snake.some((segment) => segment.x === x && segment.y === y)) {
				food = { x, y };
				return;
			}
			attempts++;
		}

		food = null;
	}

	function draw(delta: number) {
		if (!ctx) return;
		themeColors = readTheme();

		ctx.clearRect(0, 0, viewportWidth, viewportHeight);

		// Backdrop
		ctx.fillStyle = themeColors.bg;
		ctx.fillRect(0, 0, viewportWidth, viewportHeight);

		ctx.save();
		ctx.translate(offsetX, offsetY);
		drawGrid();
		drawTrail(delta);
		drawFood();
		drawSnake();
		ctx.restore();
	}

	function drawGrid() {
		if (!ctx) return;
		ctx.fillStyle = `${themeColors.line}08`;
		ctx.fillRect(0, 0, gridCols * settings.cellSize, gridRows * settings.cellSize);

		ctx.strokeStyle = `${themeColors.line}22`;
		ctx.lineWidth = 1;
		ctx.beginPath();
		for (let x = 0; x <= gridCols; x++) {
			ctx.moveTo(x * settings.cellSize + 0.5, 0);
			ctx.lineTo(x * settings.cellSize + 0.5, gridRows * settings.cellSize);
		}
		for (let y = 0; y <= gridRows; y++) {
			ctx.moveTo(0, y * settings.cellSize + 0.5);
			ctx.lineTo(gridCols * settings.cellSize, y * settings.cellSize + 0.5);
		}
		ctx.stroke();
	}

	function drawSnake() {
		if (!ctx) return;
		for (let i = snake.length - 1; i >= 0; i--) {
			const segment = snake[i];
			const alpha = i === 0 ? 1 : 0.6 + (i / snake.length) * 0.15;
			ctx.fillStyle = i === 0 ? themeColors.accent : themeColors.line;
			ctx.globalAlpha = alpha;
			ctx.fillRect(
				segment.x * settings.cellSize + 2,
				segment.y * settings.cellSize + 2,
				settings.cellSize - 4,
				settings.cellSize - 4
			);
		}
		ctx.globalAlpha = 1;
	}

	function drawFood() {
		if (!ctx || !food) return;
		ctx.fillStyle = themeColors.accent;
		const pad = 4;
		ctx.fillRect(
			food.x * settings.cellSize + pad,
			food.y * settings.cellSize + pad,
			settings.cellSize - pad * 2,
			settings.cellSize - pad * 2
		);
	}

	function drawTrail(delta: number) {
		// Subtle motion to keep the board alive when idle
		if (!ctx) return;
		const shimmer = Math.sin((lastFrame / 400 + delta) % Math.PI) * 0.04;
		ctx.fillStyle = `${themeColors.accent}0f`;
		ctx.globalAlpha = 0.4 + shimmer;
		ctx.fillRect(0, 0, gridCols * settings.cellSize, gridRows * settings.cellSize);
		ctx.globalAlpha = 1;
	}

	onMount(() => {
		resizeCanvas();
		resizeObserver = new ResizeObserver(() => resizeCanvas());
		resizeObserver.observe(canvasEl);

		return () => {
			resizeObserver?.disconnect();
			exitGame('');
		};
	});

	onDestroy(() => {
		resizeObserver?.disconnect();
		exitGame('');
	});
</script>

<div class="flex h-full flex-col">
	<div class="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
		<div class="flex items-center gap-3">
			<div class="h-8 w-8 border border-[var(--color-border)] bg-[var(--color-bg-main)] text-center text-xl leading-8">
				🐍
			</div>
			<div>
				<div class="font-mono text-sm uppercase tracking-widest">Snake</div>
				<div class="text-xs text-[var(--color-retro-muted)]">Eat the neon apples, avoid your tail.</div>
			</div>
		</div>
		<div class="flex gap-4 font-mono text-xs text-[var(--color-retro-muted)]">
			<span>SCORE: {score}</span>
			<span>BEST: {best}</span>
			<span>{running ? 'RUNNING' : 'IDLE'}</span>
		</div>
	</div>

	<div class="relative flex-1 overflow-hidden bg-[var(--color-bg-main)]">
		<canvas bind:this={canvasEl} class="h-full w-full" />

		{#if !running}
			<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div class="pointer-events-auto max-w-md border border-[var(--color-border)] bg-[var(--color-retro-card)] p-6 text-center shadow-[0_0_20px_var(--color-glow,transparent)]">
					<p class="font-mono text-sm text-[var(--color-text-main)]">
						{statusMessage}
					</p>
					<button
						class="mt-4 inline-flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-bg-main)] px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors hover:bg-[var(--color-retro-nav)]"
						onclick={startGame}
					>
						Start
					</button>
					<p class="mt-3 text-[10px] uppercase text-[var(--color-retro-muted)]">
						Arrows / WASD steer // Q or Esc exits
					</p>
				</div>
			</div>
		{:else}
			<div class="pointer-events-none absolute right-3 top-3 flex flex-col gap-1 font-mono text-[10px] uppercase text-[var(--color-retro-muted)]">
				<span>Length: {snake.length}</span>
				<span>Speed: {(1000 / moveInterval).toFixed(1)} tiles/s</span>
				<span>Q or Esc to exit</span>
			</div>
		{/if}
	</div>

	<div class="border-t border-[var(--color-border)] px-4 py-3 text-[11px] text-[var(--color-retro-muted)]">
		Controls: Arrows or WASD guide the snake. Collect squares to grow; avoid crashing into yourself or the walls.
	</div>
</div>
