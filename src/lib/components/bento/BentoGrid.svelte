<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div
	class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-2 p-2 md:auto-rows-[160px] md:grid-cols-6 md:p-4 lg:grid-cols-12"
>
	{@render children?.()}
</div>
