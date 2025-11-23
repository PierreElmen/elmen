<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let uptimeSeconds = $state(0);
	let ramUsage = $state(42); // Start at 42%
	let cpuLoad = $state(15);
	let cpuHistory = $state<number[]>(Array(8).fill(0));
	let keysPressed = $state(0);
	let mouseDistance = $state(0);
	let lastMousePos: { x: number; y: number } | null = null;

	let interval: ReturnType<typeof setInterval>;

	function formatTime(totalSeconds: number) {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}

	function getAsciiBar(percentage: number, length: number = 10) {
		const filled = Math.round((percentage / 100) * length);
		const empty = length - filled;
		return '[' + '|'.repeat(filled) + '.'.repeat(empty) + ']';
	}

	function getSparkline(history: number[]) {
		const chars = [' ', '_', '.', '-', '^'];
		return history
			.map((val) => {
				const index = Math.min(chars.length - 1, Math.floor((val / 100) * chars.length));
				return chars[index];
			})
			.join('');
	}

	function handleKeydown() {
		keysPressed++;
	}

	function handleMouseMove(event: MouseEvent) {
		if (lastMousePos) {
			const dx = event.clientX - lastMousePos.x;
			const dy = event.clientY - lastMousePos.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			mouseDistance += dist;
		}
		lastMousePos = { x: event.clientX, y: event.clientY };
	}

	onMount(() => {
		interval = setInterval(() => {
			uptimeSeconds++;

			// Randomly fluctuate RAM usage every second
			if (uptimeSeconds % 2 === 0) {
				const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
				ramUsage = Math.max(10, Math.min(90, ramUsage + change));
			}

			// Fluctuate CPU with baseline tendency
			const targetLoad = 20;
			const pull = (targetLoad - cpuLoad) * 0.2; // Pull towards baseline
			const noise = Math.floor(Math.random() * 11) - 5; // -5 to +5
			let newLoad = cpuLoad + pull + noise;

			// Occasional spike (5% chance)
			if (Math.random() < 0.05) {
				newLoad += Math.random() * 40 + 20;
			}

			cpuLoad = Math.max(5, Math.min(100, Math.round(newLoad)));
			cpuHistory = [...cpuHistory.slice(1), cpuLoad];
		}, 1000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<svelte:window onkeydown={handleKeydown} onmousemove={handleMouseMove} />

<div class="flex h-full w-full flex-col justify-center gap-1 font-mono text-[10px] leading-tight">
	<div class="flex items-center justify-between">
		<span class="text-[var(--color-retro-muted)]">RAM</span>
		<div class="flex gap-2">
			<span class="text-[var(--color-accent)]">{getAsciiBar(ramUsage, 8)}</span>
			<span class="w-6 text-right">{ramUsage}%</span>
		</div>
	</div>
	<div class="flex items-center justify-between">
		<span class="text-[var(--color-retro-muted)]">CPU</span>
		<div class="flex gap-2">
			<span class="whitespace-pre text-[var(--color-accent)]">[{getSparkline(cpuHistory)}]</span>
			<span class="w-6 text-right">{cpuLoad}%</span>
		</div>
	</div>
	<div class="flex items-center justify-between">
		<span class="text-[var(--color-retro-muted)]">KEYS</span>
		<span class="text-[var(--color-text-main)]">{keysPressed}</span>
	</div>
	<div class="flex items-center justify-between">
		<span class="text-[var(--color-retro-muted)]">DIST</span>
		<span class="text-[var(--color-text-main)]">{Math.round(mouseDistance)}px</span>
	</div>
	<div class="flex items-center justify-between">
		<span class="text-[var(--color-retro-muted)]">UPT</span>
		<span class="text-[var(--color-text-main)]">{formatTime(uptimeSeconds)}</span>
	</div>
</div>
