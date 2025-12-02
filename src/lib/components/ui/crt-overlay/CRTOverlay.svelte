<script lang="ts">
</script>

<div class="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
	<!-- Scanlines (Reduced opacity) -->
	<div
		class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]"
	></div>

	<!-- Vignette (Restored opacity) -->
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]"
	></div>

	<!-- Screen Curvature / Bezel -->
	<div class="pointer-events-none absolute inset-0 shadow-[inset_0_0_6rem_rgba(0,0,0,0.75)]"></div>

	<!-- Flicker (Rare) -->
	<div class="animate-flicker pointer-events-none absolute inset-0 bg-white opacity-[0.01]"></div>
</div>

<style>
	@keyframes flicker {
		0% {
			opacity: 0.01;
		}
		/* First glitch sequence (approx 200ms) */
		1% {
			opacity: 0.01;
		}
		1.2% {
			opacity: 0.05;
		}
		1.4% {
			opacity: 0.02;
		}
		1.6% {
			opacity: 0.06;
		}
		1.8% {
			opacity: 0.03;
		}
		2% {
			opacity: 0.01;
		}
		/* Second glitch sequence (approx 300ms) */
		6% {
			opacity: 0.01;
		}
		6.3% {
			opacity: 0.04;
		}
		6.6% {
			opacity: 0.02;
		}
		6.9% {
			opacity: 0.05;
		}
		7.2% {
			opacity: 0.01;
		}
		/* Long pause */
		100% {
			opacity: 0.01;
		}
	}
	.animate-flicker {
		animation: flicker 10s infinite;
	}
</style>
