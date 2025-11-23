<script lang="ts">
	let { number } = $props<{ number: number }>();
</script>

<div
	class="pointer-events-none absolute top-0 right-0 z-[100] flex h-5 w-5 items-center justify-center text-[10px] font-bold text-[var(--color-text-main)]"
>
	{number}
</div>
