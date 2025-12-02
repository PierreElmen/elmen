<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { inputState } from '$lib/stores/inputState.svelte';

	type Bullet = { x: number; y: number; vx: number; vy: number; life: number; dead?: boolean };
	type Asteroid = {
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
		rotation: number;
		spin: number;
		dead?: boolean;
	};
	type Ship = { x: number; y: number; vx: number; vy: number; angle: number; radius: number };

	let canvasEl: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let viewportWidth = 0;
	let viewportHeight = 0;
	let animationHandle: number | null = null;
	let resizeObserver: ResizeObserver | null = null;

	const lockId = 'asteroids';

	let running = $state(false);
	let statusMessage = $state('Press START to enter the arcade.');
	let score = $state(0);
	let lastFrame = 0;
	let lastShot = 0;

	const controls = $state({ thrust: false, left: false, right: false, shoot: false });

	let ship: Ship = $state({
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		angle: -Math.PI / 2,
		radius: 14
	});

	let bullets: Bullet[] = $state([]);
	let asteroids: Asteroid[] = $state([]);

	const settings = {
		thrustPower: 240,
		turnSpeed: Math.PI * 1.5,
		friction: 0.992,
		bulletSpeed: 420,
		bulletLifetime: 1.4,
		maxAsteroidRadius: 48,
		minAsteroidRadius: 18
	};

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
		animationHandle = requestAnimationFrame(loop);
	}

	function exitGame(reason = 'Exited the cabinet.') {
		if (animationHandle) {
			cancelAnimationFrame(animationHandle);
			animationHandle = null;
		}
		detachListeners();
		inputState.releaseControls(lockId);
		running = false;
		statusMessage = reason;
	}

	function resetArena() {
		score = 0;
		bullets = [];
		asteroids = [];
		ship.x = viewportWidth / 2;
		ship.y = viewportHeight / 2;
		ship.vx = 0;
		ship.vy = 0;
		ship.angle = -Math.PI / 2;
		spawnAsteroids(5);
		statusMessage = 'Arrow keys to steer. Space to shoot. Q or Esc to exit.';
	}

	function attachListeners() {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
	}

	function detachListeners() {
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('keyup', handleKeyUp);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (!running) return;
		const key = event.key;

		if (['ArrowUp', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) {
			event.preventDefault();
		}

		if (key === 'ArrowUp') controls.thrust = true;
		if (key === 'ArrowLeft') controls.left = true;
		if (key === 'ArrowRight') controls.right = true;
		if (key === ' ') controls.shoot = true;

		if (key === 'q' || key === 'Q' || key === 'Escape') {
			event.preventDefault();
			exitGame('Exited the cabinet.');
		}
	}

	function handleKeyUp(event: KeyboardEvent) {
		if (!running) return;
		const key = event.key;

		if (key === 'ArrowUp') controls.thrust = false;
		if (key === 'ArrowLeft') controls.left = false;
		if (key === 'ArrowRight') controls.right = false;
		if (key === ' ') controls.shoot = false;
	}

	function spawnAsteroids(count: number) {
		for (let i = 0; i < count; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = 40 + Math.random() * 50;
			let x = Math.random() * viewportWidth;
			let y = Math.random() * viewportHeight;

			// Keep spawn points away from the player's initial position
			if (Math.abs(x - viewportWidth / 2) < 140 && Math.abs(y - viewportHeight / 2) < 140) {
				x = (x + viewportWidth / 3) % viewportWidth;
				y = (y + viewportHeight / 3) % viewportHeight;
			}

			const radius =
				settings.minAsteroidRadius +
				Math.random() * (settings.maxAsteroidRadius - settings.minAsteroidRadius);

			asteroids.push({
				x,
				y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				radius,
				rotation: Math.random() * Math.PI * 2,
				spin: (Math.random() - 0.5) * 0.8
			});
		}
	}

	function loop(timestamp: number) {
		if (!running) return;
		const delta = Math.min((timestamp - lastFrame) / 1000, 0.05);
		lastFrame = timestamp;

		updateShip(delta);
		updateBullets(delta);
		updateAsteroids(delta);
		handleCollisions();
		draw();

		if (asteroids.length === 0) {
			spawnAsteroids(5 + Math.floor(score / 600));
			statusMessage = 'New wave incoming.';
		}

		animationHandle = requestAnimationFrame(loop);
	}

	function updateShip(delta: number) {
		if (controls.left) ship.angle -= settings.turnSpeed * delta;
		if (controls.right) ship.angle += settings.turnSpeed * delta;

		if (controls.thrust) {
			ship.vx += Math.cos(ship.angle) * settings.thrustPower * delta;
			ship.vy += Math.sin(ship.angle) * settings.thrustPower * delta;
		}

		ship.vx *= settings.friction;
		ship.vy *= settings.friction;

		ship.x += ship.vx * delta;
		ship.y += ship.vy * delta;

		wrap(ship, ship.radius);
	}

	function updateBullets(delta: number) {
		const toRemove: Bullet[] = [];
		for (const bullet of bullets) {
			bullet.x += bullet.vx * delta;
			bullet.y += bullet.vy * delta;
			bullet.life -= delta;

			if (bullet.life <= 0) {
				toRemove.push(bullet);
			}

			wrap(bullet, 4);
		}

		if (toRemove.length) {
			bullets = bullets.filter((b) => !toRemove.includes(b));
		}

		if (controls.shoot && performance.now() - lastShot > 200) {
			fireBullet();
		}
	}

	function updateAsteroids(delta: number) {
		for (const asteroid of asteroids) {
			asteroid.x += asteroid.vx * delta;
			asteroid.y += asteroid.vy * delta;
			asteroid.rotation += asteroid.spin * delta;
			wrap(asteroid, asteroid.radius);
		}
	}

	function fireBullet() {
		lastShot = performance.now();
		const speed = settings.bulletSpeed;
		const cos = Math.cos(ship.angle);
		const sin = Math.sin(ship.angle);

		bullets.push({
			x: ship.x + cos * ship.radius,
			y: ship.y + sin * ship.radius,
			vx: ship.vx + cos * speed,
			vy: ship.vy + sin * speed,
			life: settings.bulletLifetime
		});
	}

	function handleCollisions() {
		// Ship vs asteroids
		for (const asteroid of asteroids) {
			const dx = asteroid.x - ship.x;
			const dy = asteroid.y - ship.y;
			const distance = Math.hypot(dx, dy);

			if (distance < asteroid.radius + ship.radius) {
				exitGame('Ship destroyed. Press START to retry.');
				return;
			}
		}

		// Bullets vs asteroids
		for (const bullet of bullets) {
			for (const asteroid of asteroids) {
				if (asteroid.dead || bullet.dead) continue;
				const dx = asteroid.x - bullet.x;
				const dy = asteroid.y - bullet.y;
				if (Math.hypot(dx, dy) < asteroid.radius) {
					bullet.dead = true;
					asteroid.dead = true;
					score += Math.round(120 * (settings.maxAsteroidRadius / asteroid.radius));
					splitAsteroid(asteroid);
				}
			}
		}

		bullets = bullets.filter((b) => !b.dead);
		asteroids = asteroids.filter((a) => !a.dead);
	}

	function splitAsteroid(asteroid: Asteroid) {
		if (asteroid.radius < settings.minAsteroidRadius * 1.1) {
			return;
		}

		const pieces = 2 + Math.round(Math.random());
		for (let i = 0; i < pieces; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = 60 + Math.random() * 40;
			const radius = asteroid.radius * (0.55 + Math.random() * 0.25);
			asteroids.push({
				x: asteroid.x,
				y: asteroid.y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				radius,
				rotation: Math.random() * Math.PI * 2,
				spin: (Math.random() - 0.5) * 1.4
			});
		}
	}

	function wrap(body: { x: number; y: number }, radius: number) {
		if (body.x < -radius) body.x = viewportWidth + radius;
		if (body.x > viewportWidth + radius) body.x = -radius;
		if (body.y < -radius) body.y = viewportHeight + radius;
		if (body.y > viewportHeight + radius) body.y = -radius;
	}

	function draw() {
		if (!ctx) return;
		themeColors = readTheme();

		ctx.clearRect(0, 0, viewportWidth, viewportHeight);

		// Backdrop
		ctx.fillStyle = themeColors.bg;
		ctx.fillRect(0, 0, viewportWidth, viewportHeight);

		drawStarfield();
		drawAsteroids();
		drawBullets();
		drawShip();
	}

	function drawShip() {
		if (!ctx) return;
		ctx.save();
		ctx.translate(ship.x, ship.y);
		ctx.rotate(ship.angle);
		ctx.strokeStyle = themeColors.line;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(ship.radius, 0);
		ctx.lineTo(-ship.radius * 0.8, ship.radius * 0.65);
		ctx.lineTo(-ship.radius * 0.5, 0);
		ctx.lineTo(-ship.radius * 0.8, -ship.radius * 0.65);
		ctx.closePath();
		ctx.stroke();

		// Thruster flame
		if (controls.thrust) {
			ctx.strokeStyle = themeColors.accent;
			ctx.beginPath();
			ctx.moveTo(-ship.radius * 0.8, 0);
			ctx.lineTo(-ship.radius * 1.3, 0);
			ctx.stroke();
		}

		ctx.restore();
	}

	function drawBullets() {
		if (!ctx) return;
		ctx.save();
		ctx.strokeStyle = themeColors.accent;
		ctx.lineWidth = 2;
		for (const bullet of bullets) {
			ctx.beginPath();
			ctx.arc(bullet.x, bullet.y, 2.4, 0, Math.PI * 2);
			ctx.stroke();
		}
		ctx.restore();
	}

	function drawAsteroids() {
		if (!ctx) return;
		ctx.save();
		ctx.strokeStyle = themeColors.line;
		ctx.lineWidth = 2;
		for (const asteroid of asteroids) {
			ctx.beginPath();
			const points = 10;
			for (let i = 0; i <= points; i++) {
				const angle = asteroid.rotation + (i / points) * Math.PI * 2;
				const radius = asteroid.radius * (0.7 + Math.random() * 0.3);
				const x = asteroid.x + Math.cos(angle) * radius;
				const y = asteroid.y + Math.sin(angle) * radius;
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.closePath();
			ctx.stroke();
		}
		ctx.restore();
	}

	function drawStarfield() {
		if (!ctx) return;
		ctx.save();
		ctx.fillStyle = `${themeColors.line}22`;
		for (let i = 0; i < 32; i++) {
			const x = (i * 59 + lastFrame * 0.02) % viewportWidth;
			const y = (i * 97 + lastFrame * 0.015) % viewportHeight;
			ctx.fillRect(x, y, 2, 2);
		}
		ctx.restore();
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
				🕹️
			</div>
			<div>
				<div class="font-mono text-sm uppercase tracking-widest">Asteroids</div>
				<div class="text-xs text-[var(--color-retro-muted)]">Arrow keys to steer // Space to fire</div>
			</div>
		</div>
		<div class="flex gap-4 font-mono text-xs text-[var(--color-retro-muted)]">
			<span>SCORE: {score}</span>
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
						Q or Esc exits // Cursor control locked during play
					</p>
				</div>
			</div>
		{:else}
			<div class="pointer-events-none absolute right-3 top-3 flex flex-col gap-1 font-mono text-[10px] uppercase text-[var(--color-retro-muted)]">
				<span>Wave: {Math.max(1, Math.floor(score / 600) + 1)}</span>
				<span>Q or Esc to exit</span>
			</div>
		{/if}
	</div>

	<div class="border-t border-[var(--color-border)] px-4 py-3 text-[11px] text-[var(--color-retro-muted)]">
		Controls: Arrow keys steer, Space to shoot. Bullets split asteroids; clear waves to keep the score climbing.
	</div>
</div>
