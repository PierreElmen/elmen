<script lang="ts">
	export let showScanlines = true;
</script>

<div class="pointer-events-none fixed inset-0 z-[9998] flex items-center justify-center">
	<!-- Your original bezel frame -->
	<div
		class="index-[calc(env(safe-area-inset-top)+16px)] pointer-events-none absolute z-50 rounded-[2.5rem] shadow-[0_0_0_100vmax_#1a1a1a] transition-all duration-300"
		style="inset: 16px;"
	></div>

	<!-- Inner darkened edge (simulates CRT depth) -->
	<div
		class="pointer-events-none absolute inset-[16px] z-40 rounded-[2.5rem] shadow-[inset_0_0_4rem_rgba(0,0,0,0.8)]"
	></div>

	<!-- Screen surface (scanlines, glow, reflection) -->
	<div class="pointer-events-none absolute inset-[16px] z-30 overflow-hidden rounded-[2.5rem]">
		<!-- Scanlines -->
		{#if showScanlines}
			<div
				class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"
			></div>
		{/if}

		<!-- Flicker -->
		<div class="animate-flicker pointer-events-none absolute inset-0 bg-white opacity-[0.01]"></div>

		<!-- Glass reflection -->
		<div
			class="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-30"
			style="mix-blend-mode: overlay;"
		></div>

		<!-- Subtle phosphor glow -->
		<div class="pointer-events-none absolute inset-0 bg-green-500/5 mix-blend-overlay"></div>
	</div>
</div>

<style>
	/* ⚠️ NOTE: curvature distortion removed — done by CRTCureve instead */

	@keyframes flicker {
		0% {
			opacity: 0.01;
		}
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
		100% {
			opacity: 0.01;
		}
	}

	.animate-flicker {
		animation: flicker 10s infinite;
	}
</style>
