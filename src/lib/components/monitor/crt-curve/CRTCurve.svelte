<script lang="ts">
	import { CRTMask, CRT_MASK_PATHS } from '$lib/crtMasks';

	let { children, mask = CRTMask.IBM, scale = 0.995, tiltX = 0, tiltY = 0, curve = 900 } = $props();

	const maskUrl = $derived(CRT_MASK_PATHS[mask]);
</script>

<div
	class="crt-curve"
	style={`mask-image: url('${maskUrl}');
	        -webkit-mask-image: url('${maskUrl}');
	        --crt-scale:${scale};
	        --crt-tilt-x:${tiltX}deg;
	        --crt-tilt-y:${tiltY}deg;
	        --crt-perspective:${curve}px;`}
>
	<div class="crt-inner">
		{@render children()}
	</div>

	<div class="crt-glass"></div>
	<div class="crt-vignette"></div>
</div>

<style>
	.crt-curve {
		position: relative;

		mask-type: luminance;
		-webkit-mask-type: luminance;

		mask-size: cover;
		mask-repeat: no-repeat;
		mask-position: center;

		-webkit-mask-size: cover;
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-position: center;
	}

	.crt-inner {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 2.5rem;

		transform: perspective(var(--crt-perspective)) rotateX(var(--crt-tilt-x))
			rotateY(var(--crt-tilt-y)) scale(var(--crt-scale));

		transform-origin: center;
	}

	.crt-glass {
		pointer-events: none;
		position: absolute;
		inset: 0;
		border-radius: inherit;
		mix-blend-mode: screen;

		background: radial-gradient(
			ellipse at 50% -40%,
			rgba(255, 255, 255, 0.22) 0%,
			rgba(255, 255, 255, 0.1) 35%,
			transparent 75%
		);
	}

	/* Subtle edge darkening for fake curvature */
	.crt-vignette {
		pointer-events: none;
		position: absolute;
		inset: 0;
		border-radius: inherit;

		background: radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.35) 100%);
	}
</style>
