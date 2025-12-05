<script lang="ts">
	import { layoutState } from '$lib/stores/layoutStore.svelte';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import TerminalMail from './TerminalMail.svelte';

	let dialog: HTMLDialogElement | null = $state(null);

	function closeDialog() {
		layoutState.closeEmailDialog();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === dialog) {
			closeDialog();
		}
	}

	$effect(() => {
		if (layoutState.isEmailDialogOpen) {
			dialog?.showModal();
		} else if (dialog?.open) {
			dialog.close();
		}
	});
</script>

{#if layoutState.isEmailDialogOpen}
	<dialog
		class="email-dialog"
		bind:this={dialog}
		aria-label="Compose email"
		onclick={handleBackdropClick}
		oncancel={(event) => {
			event.preventDefault();
			closeDialog();
		}}
	>
		<div class="dialog-content" transition:fly={{ y: -14, duration: 220, easing: quintOut }}>
			<TerminalMail onclose={closeDialog} />
		</div>
	</dialog>
{/if}

<style>
	.email-dialog {
		border: none;
		padding: 0;
		background: transparent;
		width: 100%;
		max-width: none;
	}

	.email-dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
	}

	.dialog-content {
		display: flex;
		justify-content: center;
		padding: 32px;
	}
</style>
