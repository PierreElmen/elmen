import { SvelteMap } from 'svelte/reactivity';

class NavigationStore {
	// Map of ID (number) to Element
	elements = new SvelteMap<number, HTMLElement>();
	
	// Current input sequence
	input = $state('');
	
	// Timeout for executing action
	private timer: ReturnType<typeof setTimeout> | null = null;
	private readonly DELAY = 800; // ms

	// Counter for auto-assigning IDs
	private nextId = 1;

	register(element: HTMLElement): number {
		const id = this.nextId++;
		this.elements.set(id, element);
		return id;
	}

	unregister(id: number) {
		this.elements.delete(id);
	}

	handleInput(key: string) {
		// Only handle numbers
		if (!/^\d$/.test(key)) return;

		// Append to input
		this.input += key;

		// Clear existing timer
		if (this.timer) clearTimeout(this.timer);

		// If we have 2 digits, execute immediately
		if (this.input.length >= 2) {
			this.execute();
			return;
		}

		// Set new timer to execute action (waiting for potential 2nd digit)
		this.timer = setTimeout(() => {
			this.execute();
		}, this.DELAY);
	}

	execute() {
		const id = parseInt(this.input, 10);
		const element = this.elements.get(id);

		if (element) {
			element.click();
			element.focus();
		}

		// Reset input
		this.input = '';
		this.timer = null;
	}
	
	clear() {
		this.input = '';
		if (this.timer) clearTimeout(this.timer);
		this.timer = null;
	}
}

export const navigationState = new NavigationStore();
