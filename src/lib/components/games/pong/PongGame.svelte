<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { inputState } from '$lib/stores/inputState.svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let frameId: number;
	const lockId = 'pong';

	// Game State
	let running = $state(false);
	let statusMessage = $state('Press START to duel.');
	let score1 = $state(0);
	let score2 = $state(0);
	let isPaused = $state(false);
	let gameOver = $state(false);
	let winner = $state<string | null>(null);

	// Constants
	const PADDLE_WIDTH = 10;
	const PADDLE_HEIGHT = 60;
	const BALL_SIZE = 8;
	const PADDLE_SPEED = 5;
	const BALL_SPEED_INITIAL = 2.5;
	const BALL_SPEED_MAX = 12;
	const SPEED_INCREASE = 1.1;
	const WIN_SCORE = 10;

	// Objects
	let paddle1 = { x: 20, y: 0, dy: 0 };
	let paddle2 = { x: 0, y: 0, dy: 0 }; // x set in resize
	let ball = { x: 0, y: 0, dx: BALL_SPEED_INITIAL, dy: BALL_SPEED_INITIAL };

	// Input State
	const keys = {
		w: false,
		s: false,
		ArrowUp: false,
		ArrowDown: false
	};

	function resize() {
		if (!canvas) return;
		const parent = canvas.parentElement;
		if (parent) {
			canvas.width = parent.clientWidth;
			canvas.height = parent.clientHeight;

			// Reset positions based on new size
			paddle1.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
			paddle2.x = canvas.width - 20 - PADDLE_WIDTH;
			paddle2.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
			resetBall();
		}
	}

	function resetBall() {
		if (!canvas) return;
		ball.x = canvas.width / 2;
		ball.y = canvas.height / 2;
		ball.dx = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED_INITIAL;
		ball.dy = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED_INITIAL;
	}

	function startGame() {
		if (running) return;
		resize();
		score1 = 0;
		score2 = 0;
		gameOver = false;
		winner = null;
		resetBall();

		inputState.lockControls(lockId);
		running = true;
		statusMessage = '';
		frameId = requestAnimationFrame(loop);
	}

	function exitGame(reason = 'Exited the cabinet.') {
		if (frameId) {
			cancelAnimationFrame(frameId);
		}
		inputState.releaseControls(lockId);
		running = false;
		statusMessage = reason;
	}

	function update() {
		if (!canvas || isPaused || gameOver || !running) return;

		// Move Paddles
		if (keys.w && paddle1.y > 0) paddle1.y -= PADDLE_SPEED;
		if (keys.s && paddle1.y < canvas.height - PADDLE_HEIGHT) paddle1.y += PADDLE_SPEED;
		if (keys.ArrowUp && paddle2.y > 0) paddle2.y -= PADDLE_SPEED;
		if (keys.ArrowDown && paddle2.y < canvas.height - PADDLE_HEIGHT) paddle2.y += PADDLE_SPEED;

		// Move Ball
		ball.x += ball.dx;
		ball.y += ball.dy;

		// Wall Collisions (Top/Bottom)
		if (ball.y <= 0 || ball.y + BALL_SIZE >= canvas.height) {
			ball.dy *= -1;
		}

		// Paddle Collisions
		// Paddle 1 (Left)
		if (
			ball.x <= paddle1.x + PADDLE_WIDTH &&
			ball.x + BALL_SIZE >= paddle1.x &&
			ball.y + BALL_SIZE >= paddle1.y &&
			ball.y <= paddle1.y + PADDLE_HEIGHT
		) {
			// Speed up
			let newDx = Math.abs(ball.dx) * SPEED_INCREASE;
			let newDy = ball.dy * SPEED_INCREASE;

			// Clamp
			const currentSpeed = Math.hypot(newDx, newDy);
			if (currentSpeed > BALL_SPEED_MAX) {
				const scale = BALL_SPEED_MAX / currentSpeed;
				newDx *= scale;
				newDy *= scale;
			}

			ball.dx = newDx;
			ball.dy = newDy;
			ball.x = paddle1.x + PADDLE_WIDTH; // Push out
		}

		// Paddle 2 (Right)
		if (
			ball.x + BALL_SIZE >= paddle2.x &&
			ball.x <= paddle2.x + PADDLE_WIDTH &&
			ball.y + BALL_SIZE >= paddle2.y &&
			ball.y <= paddle2.y + PADDLE_HEIGHT
		) {
			// Speed up
			let newDx = Math.abs(ball.dx) * SPEED_INCREASE;
			let newDy = ball.dy * SPEED_INCREASE;

			// Clamp
			const currentSpeed = Math.hypot(newDx, newDy);
			if (currentSpeed > BALL_SPEED_MAX) {
				const scale = BALL_SPEED_MAX / currentSpeed;
				newDx *= scale;
				newDy *= scale;
			}

			ball.dx = -newDx;
			ball.dy = newDy;
			ball.x = paddle2.x - BALL_SIZE; // Push out
		}

		// Scoring
		if (ball.x < 0) {
			score2++;
			checkWin();
			resetBall();
		} else if (ball.x > canvas.width) {
			score1++;
			checkWin();
			resetBall();
		}
	}

	function checkWin() {
		if (score1 >= WIN_SCORE) {
			gameOver = true;
			winner = 'PLAYER 1';
			exitGame('PLAYER 1 WINS!');
		} else if (score2 >= WIN_SCORE) {
			gameOver = true;
			winner = 'PLAYER 2';
			exitGame('PLAYER 2 WINS!');
		}
	}

	function draw() {
		if (!ctx || !canvas) return;

		// Clear
		ctx.fillStyle = getThemeColor('bg');
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Draw Net
		ctx.strokeStyle = getThemeColor('border');
		ctx.setLineDash([5, 15]);
		ctx.beginPath();
		ctx.moveTo(canvas.width / 2, 0);
		ctx.lineTo(canvas.width / 2, canvas.height);
		ctx.stroke();
		ctx.setLineDash([]);

		// Draw Paddles
		ctx.fillStyle = getThemeColor('accent');
		ctx.fillRect(paddle1.x, paddle1.y, PADDLE_WIDTH, PADDLE_HEIGHT);
		ctx.fillRect(paddle2.x, paddle2.y, PADDLE_WIDTH, PADDLE_HEIGHT);

		// Draw Ball
		ctx.fillStyle = getThemeColor('text');
		ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
	}

	function loop() {
		if (!running) return;
		update();
		draw();
		frameId = requestAnimationFrame(loop);
	}

	function getThemeColor(type: 'bg' | 'text' | 'accent' | 'border') {
		if (typeof window === 'undefined') return '#000';
		const style = getComputedStyle(document.documentElement);
		switch (type) {
			case 'bg':
				return style.getPropertyValue('--color-retro-card').trim();
			case 'text':
				return style.getPropertyValue('--color-text-main').trim();
			case 'accent':
				return style.getPropertyValue('--color-accent').trim();
			case 'border':
				return style.getPropertyValue('--color-border').trim();
		}
		return '#fff';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!running) return;

		if (e.key === 'w' || e.key === 'W') keys.w = true;
		if (e.key === 's' || e.key === 'S') keys.s = true;
		if (e.key === 'ArrowUp') keys.ArrowUp = true;
		if (e.key === 'ArrowDown') keys.ArrowDown = true;

		if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
			exitGame('Exited the cabinet.');
		}
	}

	function handleKeyup(e: KeyboardEvent) {
		if (!running) return;

		if (e.key === 'w' || e.key === 'W') keys.w = false;
		if (e.key === 's' || e.key === 'S') keys.s = false;
		if (e.key === 'ArrowUp') keys.ArrowUp = false;
		if (e.key === 'ArrowDown') keys.ArrowDown = false;
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		resize();
		window.addEventListener('resize', resize);

		// Initial draw for background
		draw();

		return () => {
			window.removeEventListener('resize', resize);
			exitGame('');
		};
	});

	onDestroy(() => {
		exitGame('');
	});
</script>

<svelte:window onkeydown={handleKeydown} onkeyup={handleKeyup} />

<div class="flex h-full flex-col">
	<div class="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
		<div class="flex items-center gap-3">
			<div
				class="grid h-8 w-8 place-items-center border border-[var(--color-border)] bg-[var(--color-bg-main)]"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="6" height="16" x="4" y="4" rx="1"/><rect width="6" height="16" x="14" y="4" rx="1"/><circle cx="12" cy="12" r="2"/></svg>
			</div>
			<div>
				<div class="font-mono text-sm tracking-widest uppercase">Pong Duel</div>
				<div class="text-xs text-[var(--color-retro-muted)]">P1: W/S // P2: UP/DOWN</div>
			</div>
		</div>
		<div class="flex gap-4 font-mono text-xs text-[var(--color-retro-muted)]">
			<span>SCORE: {score1} - {score2}</span>
			<span>{running ? 'RUNNING' : 'IDLE'}</span>
		</div>
	</div>

	<div class="relative flex-1 overflow-hidden bg-[var(--color-bg-main)]">
		<canvas bind:this={canvas} class="block h-full w-full"></canvas>

		{#if !running}
			<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div
					class="pointer-events-auto max-w-md border border-[var(--color-border)] bg-[var(--color-retro-card)] p-6 text-center shadow-[0_0_20px_var(--color-glow,transparent)]"
				>
					<p class="font-mono text-sm text-[var(--color-text-main)]">
						{statusMessage}
					</p>
					<button
						class="mt-4 inline-flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-bg-main)] px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors hover:bg-[var(--color-retro-nav)]"
						onclick={startGame}
					>
						Start
					</button>
					<p class="mt-3 text-[10px] text-[var(--color-retro-muted)] uppercase">
						Q or Esc exits // Cursor control locked during play
					</p>
				</div>
			</div>
		{:else}
			<!-- In-game UI Overlay -->
			<div class="pointer-events-none absolute inset-0 flex flex-col justify-end p-4">
				<!-- Scores -->
				<div
					class="flex w-full justify-between text-4xl font-bold text-[var(--color-text-main)] opacity-50"
				>
					<div class="pl-20">{score1}</div>
					<div class="pr-20">{score2}</div>
				</div>

				<div
					class="pointer-events-none absolute top-3 right-3 flex flex-col gap-1 text-right font-mono text-[10px] text-[var(--color-retro-muted)] uppercase"
				>
					<span>First to {WIN_SCORE} wins</span>
					<span>Q or Esc to exit</span>
				</div>
			</div>
		{/if}
	</div>

	<div
		class="border-t border-[var(--color-border)] px-4 py-3 text-[11px] text-[var(--color-retro-muted)]"
	>
		Controls: Player 1 uses W/S. Player 2 uses Arrow Keys. Defend your side and score 10 points to
		win.
	</div>
</div>
