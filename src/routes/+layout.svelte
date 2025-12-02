<script lang="ts">
	import '../app.css';
	import NavLeft from '$lib/components/nav/NavLeft.svelte';
	import SlidePanel from '$lib/components/modal/SlidePanel.svelte';
	import Crosshair from '$lib/components/ui/Crosshair.svelte';
	import InputDisplay from '$lib/components/ui/InputDisplay.svelte';
	import CRTOverlay from '$lib/components/ui/CRTOverlay.svelte';
	import { layoutState } from '$lib/stores/layoutStore.svelte';
	import { navigationState } from '$lib/stores/navigationStore.svelte';
	import { inputState } from '$lib/stores/inputState.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	// Crosshair state
	let crosshairX = $state(0);
	let crosshairY = $state(0);
	let crosshairVisible = $state(false);
	const STEP = 20; // Pixels to move per key press
	const controlsLocked = $derived(inputState.isLocked);
	const crosshairSuppressed = $derived(inputState.crosshairSuppressed);

	onMount(() => {
		// Ensure theme is applied on client mount
		layoutState.setTheme(layoutState.theme);

		// Initialize crosshair to center of screen
		if (typeof window !== 'undefined') {
			crosshairX = window.innerWidth / 2;
			crosshairY = window.innerHeight / 2;
		}
	});

	function handleKeydown(event: KeyboardEvent) {
		if (controlsLocked) {
			return;
		}

		const key = event.key;
		const isArrow = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key);
		const isAction = ['Enter', ' '].includes(key);
		const isNumber = /^\d$/.test(key);

		if (key === 'Escape') {
			layoutState.closeModal();
			return;
		}

		if (isNumber) {
			// Let navigation store handle numbers
			navigationState.handleInput(key);
			// We don't prevent default here as typing numbers might be needed for other things,
			// but usually in a navigation context it's fine.
			// If we want to prevent scrolling (e.g. Space) or other actions, we can.
		} else if (isArrow) {
			event.preventDefault(); // Prevent scrolling
			crosshairVisible = true;
			navigationState.clear(); // Clear any pending number input

			if (key === 'ArrowUp') crosshairY -= STEP;
			if (key === 'ArrowDown') crosshairY += STEP;
			if (key === 'ArrowLeft') crosshairX -= STEP;
			if (key === 'ArrowRight') crosshairX += STEP;

			// Clamp to viewport
			crosshairX = Math.max(0, Math.min(window.innerWidth, crosshairX));
			crosshairY = Math.max(0, Math.min(window.innerHeight, crosshairY));
		} else if (isAction && crosshairVisible) {
			event.preventDefault(); // Prevent default action (like scrolling for Space)
			navigationState.clear(); // Clear any pending number input

			// Perform click at crosshair position
			let element = document.elementFromPoint(crosshairX, crosshairY);

			// Traverse up to find the closest interactive element
			while (element && element !== document.body) {
				const tag = element.tagName.toLowerCase();
				const isInteractive =
					tag === 'button' ||
					tag === 'a' ||
					tag === 'input' ||
					tag === 'textarea' ||
					tag === 'select' ||
					element.hasAttribute('onclick') ||
					element.getAttribute('role') === 'button';

				if (isInteractive) {
					(element as HTMLElement).click();
					(element as HTMLElement).focus();
					break;
				}

				element = element.parentElement;
			}
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (crosshairSuppressed) {
			return;
		}

		// Update crosshair position to follow mouse
		crosshairX = event.clientX;
		crosshairY = event.clientY;
		crosshairVisible = true;
	}

	// Hide crosshair immediately when a game or other feature locks input
	$effect(() => {
		if (crosshairSuppressed) {
			crosshairVisible = false;
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} onmousemove={handleMouseMove} />

<div class="flex min-h-screen bg-[var(--color-bg-main)]">
	<!-- CRT Overlay -->
	<CRTOverlay />

	<!-- Input Display Overlay -->
	<InputDisplay />

	<!-- Crosshair Overlay -->
	<Crosshair x={crosshairX} y={crosshairY} visible={crosshairVisible} />

	<!-- Fixed Left Navigation -->
	<NavLeft />

	<!-- Sliding Modal Panel -->
	<SlidePanel />

	<!-- Main Content Area -->
	<!-- 
        We use a transition on margin-left to "squeeze" the content.
        Since the nav is fixed width (64px), the content starts at ml-[64px].
        When modal opens, we increase margin-left by modal width (420px) on desktop.
    -->
	<main
		class="min-h-screen flex-1 transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]"
		style:margin-left={layoutState.isModalOpen
			? 'calc(var(--nav-width) + var(--modal-width))'
			: 'var(--nav-width)'}
		style:width={layoutState.isModalOpen
			? 'calc(100% - var(--nav-width) - var(--modal-width))'
			: 'calc(100% - var(--nav-width))'}
	>
		<div class="h-full w-full">
			{@render children()}
		</div>
	</main>
</div>
