<script lang="ts">
	let { x, y, visible } = $props<{ x: number; y: number; visible: boolean }>();
</script>

{#if visible}
	<div
		class="pointer-events-none fixed z-[9999] flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
		style:left="{x}px"
		style:top="{y}px"
	>
		<!-- Horizontal line -->
		<div
			class="absolute h-[2px] w-full bg-[var(--color-text-main)] shadow-[0_0_4px_var(--color-text-main)]"
		></div>
		<!-- Vertical line -->
		<div
			class="absolute h-full w-[2px] bg-[var(--color-text-main)] shadow-[0_0_4px_var(--color-text-main)]"
		></div>
	</div>
{/if}
