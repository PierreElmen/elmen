<script lang="ts">
	import { layoutState } from '$lib/stores/layoutStore.svelte';
	import { inputState } from '$lib/stores/inputState.svelte';
	import { onMount } from 'svelte';

	let message = $state('');
	let cursorPosition = $state(0);
	let terminalRef: HTMLDivElement | null = $state(null);
	let blinkOn = $state(true);
	let isTextFieldFocused = $state(false);

	const messageParts = $derived.by(() => {
		const before = message.slice(0, cursorPosition);
		const cursorChar = message[cursorPosition] ?? ' ';
		const after = message.slice(cursorPosition + 1);
		return { before, cursor: cursorChar, after };
	});

	function handleTerminalFocus() {
		isTextFieldFocused = true;
		inputState.lockControls('terminal-mail');
	}

	function handleTerminalBlur() {
		isTextFieldFocused = false;
		inputState.releaseControls('terminal-mail');
	}

	function sendEmail() {
		const mailtoLink = `mailto:pierre@elmen.dev?body=${encodeURIComponent(message)}`;
		window.open(mailtoLink, '_blank');
	}

	function handleMailKeydown(event: KeyboardEvent) {
		const value = message;

		// Escape to close panel
		if (event.key === 'Escape') {
			event.preventDefault();
			layoutState.closeModal();
			return;
		}

		// Cmd/Ctrl+Enter to send
		if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			event.stopPropagation();
			sendEmail();
			return;
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			event.stopPropagation();
			cursorPosition = Math.max(0, cursorPosition - 1);
			return;
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			event.stopPropagation();
			cursorPosition = Math.min(value.length, cursorPosition + 1);
			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			event.stopPropagation();
			const lines = value.slice(0, cursorPosition).split('\n');
			if (lines.length > 1) {
				const currentLineStart = cursorPosition - (lines[lines.length - 1]?.length ?? 0);
				const prevLineStart = currentLineStart - 1 - (lines[lines.length - 2]?.length ?? 0);
				const posInLine = lines[lines.length - 1]?.length ?? 0;
				const prevLineLen = lines[lines.length - 2]?.length ?? 0;
				cursorPosition = prevLineStart + Math.min(posInLine, prevLineLen);
			}
			return;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			event.stopPropagation();
			const beforeCursor = value.slice(0, cursorPosition);
			const afterCursor = value.slice(cursorPosition);
			const linesBefore = beforeCursor.split('\n');
			const linesAfter = afterCursor.split('\n');

			if (linesAfter.length > 1) {
				const posInLine = linesBefore[linesBefore.length - 1]?.length ?? 0;
				const restOfCurrentLine = linesAfter[0]?.length ?? 0;
				const nextLineLen = linesAfter[1]?.length ?? 0;
				cursorPosition = cursorPosition + restOfCurrentLine + 1 + Math.min(posInLine, nextLineLen);
			} else {
				cursorPosition = value.length;
			}
			return;
		}

		if (event.key === 'Backspace') {
			event.preventDefault();
			if (cursorPosition > 0) {
				message = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
				cursorPosition--;
			}
			return;
		}

		if (event.key === 'Delete') {
			event.preventDefault();
			if (cursorPosition < value.length) {
				message = value.slice(0, cursorPosition) + value.slice(cursorPosition + 1);
			}
			return;
		}

		if (event.key === 'Enter') {
			event.preventDefault();
			message = value.slice(0, cursorPosition) + '\n' + value.slice(cursorPosition);
			cursorPosition++;
			return;
		}

		if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
			event.preventDefault();
			message = value.slice(0, cursorPosition) + event.key + value.slice(cursorPosition);
			cursorPosition++;
		}
	}

	function handleFieldClick() {
		cursorPosition = message.length;
		terminalRef?.focus();
	}

	onMount(() => {
		const interval = setInterval(() => {
			blinkOn = !blinkOn;
		}, 530);
		return () => clearInterval(interval);
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="mt-4 flex flex-1 flex-col text-sm leading-relaxed outline-none"
	bind:this={terminalRef}
	tabindex="0"
	role="textbox"
	aria-label="Compose email"
	onkeydown={handleMailKeydown}
	onfocus={handleTerminalFocus}
	onblur={handleTerminalBlur}
>
	<div class="flex items-center gap-2 text-[var(--color-text-muted)]">
		<span class="font-semibold text-[var(--color-accent)]">&gt;</span>
		<span class="text-[var(--color-text-main)]">mail pierre@elmen.dev</span>
	</div>

	<div class="h-3"></div>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="flex min-h-[200px] flex-1 cursor-text flex-col items-start justify-start border border-[var(--color-border)] bg-[var(--color-bg-main)] p-3 hover:border-[var(--color-text-muted)] focus-within:border-[var(--color-accent)]"
		onclick={() => handleFieldClick()}
	>
		<pre
			class="m-0 whitespace-pre-wrap break-words font-[inherit] text-[var(--color-text-main)]">{messageParts.before}<span
				class="bg-[var(--color-text-main)] text-[var(--color-bg-card)]"
				class:opacity-0={!isTextFieldFocused || !blinkOn}>{messageParts.cursor}</span
			>{messageParts.after}</pre>
	</div>

	<div class="mt-4 flex items-center justify-end gap-4">
		<span class="text-xs text-[var(--color-retro-muted)]">PRESS [⌘+ENTER] TO SEND</span>
		<button
			type="button"
			class="cursor-pointer border border-[var(--color-border)] bg-[var(--color-text-main)] px-3.5 py-2 font-mono text-[11px] tracking-widest text-[var(--color-bg-main)] transition-transform hover:-translate-y-0.5"
			onclick={sendEmail}
		>
			[SEND]
		</button>
	</div>
</div>
