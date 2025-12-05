<script lang="ts">
	interface Props {
		modalId: string;
	}

	let { modalId }: Props = $props();
</script>

<div
	class="mt-8 border border-dashed border-[var(--color-border)] bg-[var(--color-bg-main)] p-4"
>
	<p class="text-xs text-[var(--color-retro-muted)]">
		Placeholder content area for {modalId}
	</p>
</div>
